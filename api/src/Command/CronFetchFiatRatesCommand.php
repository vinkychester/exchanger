<?php

namespace App\Command;

use App\Entity\Currency;
use App\Entity\RateHistory;
use App\Entity\Service;
use App\Service\RateBuilder\RateBuilder;

use App\Utils\Authenticator;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Rate\getAll as CPRateResponse;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Rate\RateCurrency;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Rate\RateService;
use ItlabStudio\ApiClient\Service\ApiClient;
use Rate\Rate\Rate;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class CronFetchFiatRatesCommand
 * @package App\Command
 */
class CronFetchFiatRatesCommand extends Command
{
    /**
     * @var string
     * php bin/console cron:fetchFiatRates
     */
    protected static $defaultName = 'cron:fetchFiatRates';

    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CronFetchRatesCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    protected function configure()
    {
        $this
            ->setDescription('Cron command to update currencies` rates')
            ->addArgument('id', InputArgument::OPTIONAL, 'Please add the "id" argument to fetch rate by id');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $argID = $input->getArgument('id');

        if ($argID) {
            $io->note(sprintf('You passed an argument: %s', $argID));
        } else {
            try {
                $credential = Authenticator::login(
                    'rate',
                    'xdJCGsnHW_Aefgugn1TjTDAQVGgmMgmKdehHSsySYvA',
                    'ar-7XdT6hD7xsIPADgNVvQnvXBbc9vVtmxxrqpVpEqo'
                );
                $ratesResponse = Rate::generateCurrency($credential['token']);
                $data = [];

                foreach ($ratesResponse as $value) {
                    $data[$value['symbol']] = $value;
                }

                $availableCurrencies = $this->entityManager->getRepository(Currency::class)
                    ->findBy(['tag' => Currency::TYPE_CURRENCY]);
//                $criteria = Criteria::create()->where(Criteria::expr()->notIn('tag', ['hcrypto']));
//                $results = $this->entityManager->getRepository(Service::class)->matching($criteria);
//
//                $collection = new ArrayCollection();
//
//                foreach ($results as $service) {
//                    foreach ($ratesResponse as $rateValue) {
//                        $rate = (new CPRateResponse())->setService(
//                            (new RateService())
//                                ->setTitle($this->convertTitle($service->getName()))
//                                ->setTag($service->getTag())
//                        )
//                            ->setCurrency(
//                                (new RateCurrency())
//                                    ->setType(Currency::TYPE_CURRENCY)
//                                    ->setAsset($rateValue['symbol'])
//                            );
//                        $rate->setRate($rateValue['price']);
//                        $rate->setPurchase($rateValue['purchase']);
//                        $rate->setSelling($rateValue['selling']);
//
//                        $collection->add($rate);
//                    }
//                }

                /** @var Currency $currency */
                foreach ($availableCurrencies as $currency) {
                    $a = $data[$currency->getAsset()];
                    $currency->setRate($a['price'])->setPaymentRate($a['purchase'])->setPayoutRate($a['selling']);
                    $this->entityManager->persist($currency);
                    $this->entityManager->persist(
                        (new RateHistory())
                            ->setServiceName($currency->getServiceName())
                            ->setCurrencyAsset($currency->getAsset())
                            ->setRate($currency->getRate())
                            ->setPaymentRate($currency->getPaymentRate())
                            ->setPayoutRate($currency->getPayoutRate())
                            ->setLastUpdate(time())
                    );
                }

                $this->entityManager->flush();


//                (new RateBuilder($this->entityManager))
//                    ->setAvailableCurrencies($availableCurrencies)
//                    ->setItems($collection)
//                    ->storeItems();
            } catch (Exception $e) {
                $io->error('Your command failed or have been executed partially. Error message:' . $e->getMessage());

                return Command::FAILURE;
            }
        }

        $io->success('Rates have been successfully inserted to database. Time: ' . date("Y-m-d H:i:s"));

        return Command::SUCCESS;
    }

    /**
     * @param $name
     * @return string
     */
    protected function convertTitle($name)
    {
        return [
                   'WhiteBit' => 'Crypto2 Service',
                   'Huobi' => 'Crypto1 Service',
                   'UaPay'  => 'Uah1 Service',
                   'Decta'  => 'Usd1 Service',
                   'ADG'  => 'Rub2 Service',
                   'AdvCash'  => 'Rub1 Service',
                   'MicroserviceCash'  => 'Cash Service',
                   'Kuna'  => 'Uah2 Service',
               ][$name] ?? $name;
    }
}
