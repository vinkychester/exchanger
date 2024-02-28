<?php


namespace App\Service\RateMonitoring;


use App\Entity\Currency;
use App\Entity\Pair;
use Calculation\Service\Limits;
use ItlabStudio\ApiClient\Service\ApiClient;

class RateMonitoringService
{

    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * RateMonitoringService constructor.
     * @param ApiClient $apiClient
     */
    public function __construct(ApiClient $apiClient)
    {
        $this->apiClient = $apiClient;
    }

    /**
     * @param $pairs
     * @param $xml
     * @param null $city
     * @return mixed
     */
    public function bestChangeXML($pairs, $xml, $city = null)
    {
        foreach ($pairs as $pair) {
            Limits::calculateMax($pair);
            Limits::calculateMin($pair);
            switch ($pair->getPayment()->getCurrency()->getTag()) {
                case Currency::TYPE_CRYPTO :
                    {
                        $track = $xml->addChild('item');
                        $track->addChild('from', $this->tetherAsset($pair->getPayment()->getCurrency()->getAsset()));
                        $track->addChild(
                            'to',
                            $pair->getPayout()->getPaymentSystem()->getTag() . '' . $pair->getPayout()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('in', 1);
                        $track->addChild(
                            'out',
                            number_format(
                                $pair->getPaymentRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild('fromfee',
                                         $pair->getPayment()->getFee()->getConstant() * ($pair->getPayment(
                                             )->getCurrency()->getPaymentRate() * $pair->getPayout()->getCurrency(
                                             )->getPayoutRate()) . ' ' . $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('tofee',
                                         $pair->getPayout()->getFee()->getConstant() . ' ' . $pair->getPayout(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('param', 'floating, reg');
                        if ($city) {
                            $track->addChild('city', $this->cityName($city->getTranslateName()));
                        }
                    }
                    break;
                case Currency::TYPE_CURRENCY:
                    {
                        $track = $xml->addChild('item');
                        $track->addChild(
                            'from',
                            $pair->getPayment()->getPaymentSystem()->getTag() . '' . $pair->getPayment()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('to', $this->tetherAsset($pair->getPayout()->getCurrency()->getAsset()));
                        $track->addChild(
                            'in',
                            number_format(
                                $pair->getPayoutRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('out', 1);
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild('fromfee',
                                         $pair->getPayment()->getFee()->getConstant() . ' ' . $pair->getPayment(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild('tofee',
                                         $pair->getPayout()->getFee()->getConstant() * $pair->getPayoutRate(
                                         ) . ' ' . $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        if ($pair->getPayment()->getIsCardVerification()) {
                            $track->addChild('param', 'cardverify, floating, reg, card2card');
                        } elseif ($pair->getPayment()->getPaymentSystem()->getSubName() !== 'CASH') {
                            $track->addChild('param', 'floating, reg, card2card');
                        } else {
                            $track->addChild('param', 'floating, reg');
                        }
                        if ($city) {
                            $track->addChild('city', $this->cityName($city->getTranslateName()));
                        }
                    }
                    break;
            }
        }

        return $xml;
    }

    /**
     * @param $asset
     * @return string
     */
    protected function tetherAsset($asset): string
    {
        return [
                   'USDT (ERC20)' => 'USDTERC',
                   'USDT (TRC20)' => 'USDTTRC',
                   'USDT (OMNI)'  => 'USDT'
               ][$asset] ?? $asset;
    }

    /**
     * @param $asset
     * @return string
     */
    protected function tetherAssetKursExpert($asset): string
    {
        return [
                   'USDT (ERC20)' => 'USDTERC',
                   'USDT (TRC20)' => 'USDTTRC',
                   'USDT (OMNI)'  => 'USDTOM'
               ][$asset] ?? $asset;
    }

    /**
     * @param $name
     * @return string
     */
    protected function cityName($name)
    {
        return [
                   'Zhytomyr'        => 'ZHYTO',
                   'Kiev'            => 'KIEV',
                   'Vinnitsa'        => 'VINN',
                   'Dnepr'           => 'DNPR',
                   'Zaporozhe'       => 'ZAP',
                   'Ivano Frankovsk' => 'IVFR',
                   'Krivoy Rog'      => 'KRVR',
                   'Kropivnitskiy'   => 'KROP',
                   'Lutsk'           => 'LUTSK',
                   'lvov'            => 'LVOV',
                   'Mariupol'        => 'MRPL',
                   'Nikolaev'        => 'MYKL',
                   'Odessa'          => 'ODS',
                   'Poltava'         => 'POLT',
                   'Rovno'           => 'RIVNE',
                   'Sumy'            => 'SUMY',
                   'Ternopol'        => 'TERNO',
                   'Uzhgorod'        => 'UZHH',
                   'Kharkov'         => 'HRK',
                   'Kherson'         => 'KHERS',
                   'Khmelnitskiy'    => 'HMLN',
                   'Cherkassy'       => 'CHERK',
                   'Chernigov'       => 'CHRN',
                   'Chernovtsy'      => 'CHERN',
                   'Kremenchug'      => 'KRMN',
               ][$name] ?? $name;
    }

    /**
     * @return mixed
     */
    public function getCities()
    {
        $networkResponse = $this->apiClient->ControlPanel()->Payment()->external(
            [
                "connection" => $_ENV['CP_MICC_CONNECTION']
            ]
        );

        return $networkResponse->getData()->first()->getFetchingCities();
    }

    /**
     * @param $pairs
     * @param $xml
     * @param null $city
     * @return mixed
     */
    public function kursExpertXML($pairs, $xml, $city = null)
    {
        foreach ($pairs as $pair) {
            Limits::calculateMax($pair);
            Limits::calculateMin($pair);
            switch ($pair->getPayment()->getCurrency()->getTag()) {
                case Currency::TYPE_CRYPTO :
                    {
                        $track = $xml->addChild('item');
                        $track->addChild('from', $this->tetherAssetKursExpert($pair->getPayment()->getCurrency()->getAsset()));
                        $track->addChild(
                            'to',
                            $pair->getPayout()->getPaymentSystem()->getTag() . '' . $pair->getPayout()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('in', 1);
                        $track->addChild(
                            'out',
                            number_format(
                                $pair->getPaymentRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild(
                            'fromfee',
                            $pair->getPayment()->getFee()->getConstant() . ' ' . $this->tetherAssetKursExpert(
                                $pair->getPayment()->getCurrency()->getAsset()
                            )
                        );
                        $track->addChild('tofee',
                                         $pair->getPayout()->getFee()->getConstant() . ' ' . $pair->getPayout(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('param', 'floating');
                        if ($city) {
                            $track->addChild('city', 'KIEV');
                        }
                    }
                    break;
                case Currency::TYPE_CURRENCY:
                    {
                        $track = $xml->addChild('item');
                        $track->addChild(
                            'from',
                            $pair->getPayment()->getPaymentSystem()->getTag() . '' . $pair->getPayment()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('to', $this->tetherAssetKursExpert($pair->getPayout()->getCurrency()->getAsset()));
                        $track->addChild(
                            'in',
                            number_format(
                                $pair->getPayoutRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('out', 1);
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild('fromfee',
                                         $pair->getPayment()->getFee()->getConstant() . ' ' . $pair->getPayment(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'tofee',
                            $pair->getPayout()->getFee()->getConstant() . ' ' . $this->tetherAssetKursExpert(
                                $pair->getPayout()->getCurrency()->getAsset()
                            )
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        if ($pair->getPayment()->getIsCardVerification()) {
                            $track->addChild('param', 'cardverify, floating');
                        } else {
                            $track->addChild('param', 'floating');
                        }
                        if ($city) {
                            $track->addChild('city', 'KIEV');
                        }
                    }
                    break;
            }
        }

        return $xml;
    }

    /**
     * @param $pairs
     * @param $xml
     * @return mixed
     */
    public function exchangeSumoXML($pairs, $xml)
    {
        foreach ($pairs as $pair) {
            Limits::calculateMax($pair);
            Limits::calculateMin($pair);
            switch ($pair->getPayment()->getCurrency()->getTag()) {
                case Currency::TYPE_CRYPTO :
                    {
                        $track = $xml->addChild('item');
                        $track->addChild('from', $this->tetherAsset($pair->getPayment()->getCurrency()->getAsset()));
                        $track->addChild(
                            'to',
                            $pair->getPayout()->getPaymentSystem()->getTag() . '' . $pair->getPayout()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('in', 1);
                        $track->addChild(
                            'out',
                            number_format(
                                $pair->getPaymentRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild(
                            'fromfee',
                            number_format(
                                $pair->getPayment()->getFee()->getConstant() * $pair->getPaymentRate(),
                                2,
                                '.',
                                ''
                            )
                            . ' ' . $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('tofee',
                                         $pair->getPayout()->getFee()->getConstant() . ' ' . $pair->getPayout(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('param', 'floating, reg');
                    }
                    break;
                case Currency::TYPE_CURRENCY:
                    {
                        $track = $xml->addChild('item');
                        $track->addChild(
                            'from',
                            $pair->getPayment()->getPaymentSystem()->getTag() . '' . $pair->getPayment()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('to', $this->tetherAsset($pair->getPayout()->getCurrency()->getAsset()));
                        $track->addChild(
                            'in',
                            number_format(
                                $pair->getPayoutRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('out', 1);
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild('fromfee',
                                         $pair->getPayment()->getFee()->getConstant() . ' ' . $pair->getPayment(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'tofee',
                            number_format(
                                $pair->getPayout()->getFee()->getConstant() * $pair->getPayoutRate(),
                                2,
                                '.',
                                ''
                            ) . ' ' . $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        if ($pair->getPayment()->getIsCardVerification()) {
                            $track->addChild('param', 'cardverify, floating, reg, card2card');
                        } elseif ($pair->getPayment()->getPaymentSystem()->getSubName() !== 'CASH') {
                            $track->addChild('param', 'floating, reg, card2card');
                        } else {
                            $track->addChild('param', 'floating, reg');
                        }
                    }
                    break;
            }
        }

        return $xml;
    }

    /**
     * @param $pairs
     * @param $data
     * @param null $city
     * @return array
     */
    public function kursesJson($pairs, $data, $city = null)
    {
        /**
         * @var Pair $pair
         */
        foreach ($pairs as $pair) {
            Limits::calculateMax($pair);
            Limits::calculateMin($pair);
            switch ($pair->getPayment()->getCurrency()->getTag()) {
                case Currency::TYPE_CRYPTO :
                    {
                        $data['currencies']['list'][$pair->getPayment()->getId()] = $this->tetherAsset(
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $data['currencies']['list'][$pair->getPayout()->getId()] = $pair->getPayout()->getPaymentSystem(
                            )->getTag() . '' . $pair->getPayout()->getCurrency()->getAsset();
                        $data['options'] = ['auth' => 1];
                        if ($city) {
                            if (number_format(
                                    $pair->getPayoutRate(),
                                    6,
                                    '.',
                                    ''
                                ) < 1) {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId()] = [
                                    'xr'     => (float)number_format(
                                        1 / $pair->getPayoutRate(),
                                        6,
                                        '.',
                                        ''
                                    ),
                                    'cities' => ['KIEV']
                                ];
                            } else {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId()] = [
                                    'xr'     => -(float)number_format(
                                        $pair->getPayoutRate(),
                                        6,
                                        '.',
                                        ''
                                    ),
                                    'cities' => ['KIEV'],
                                ];
                            }
                        } else {
                            if (number_format($pair->getPayoutRate(), 6, '.', '') < 1) {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId(
                                )] = (float)number_format(
                                    1 / $pair->getPayoutRate(),
                                    6,
                                    '.',
                                    ''
                                );
                            } else {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId(
                                )] = -(float)number_format(
                                    $pair->getPayoutRate(),
                                    6,
                                    '.',
                                    ''
                                );
                            }
                        }
                        $data['exchange'][$pair->getPayment()->getId()]['min'] =
                            (float)number_format($pair->getPayment()->getMin(), 6, '.', '');
                        $data['exchange'][$pair->getPayment()->getId()]['max'] =
                            (float)number_format($pair->getPayment()->getMax(), 6, '.', '');
                        if ($pair->getPayment()->getFee()->getConstant()) {
                            $data['currencies']['fees'][$pair->getPayment()->getId()] = [
                                'in'  => $pair->getPayment()->getFee()->getConstant(),
                            ];
                        }
                        if ($pair->getPayout()->getFee()->getConstant()) {
                            $data['currencies']['fees'][$pair->getPayout()->getId()] = [
                                'out' => $pair->getPayout()->getFee()->getConstant()
                            ];
                        }
                    }
                    break;
                case Currency::TYPE_CURRENCY :
                    {
                        $data['currencies']['list'][$pair->getPayment()->getId()] = $pair->getPayment(
                            )->getPaymentSystem()->getTag() . '' . $pair->getPayment()->getCurrency()->getAsset();
                        $data['currencies']['list'][$pair->getPayout()->getId()] = $this->tetherAsset(
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $data['options'] = ['auth' => 1];
                        if ($pair->getPayment()->getIsCardVerification()) {
                            $data['exchange'][$pair->getPayment()->getId()] = ['option' => ['ident' => 1]];
                        }
                        if ($city) {
                            if (number_format(
                                    $pair->getPaymentRate(),
                                    6,
                                    '.',
                                    ''
                                ) < 1) {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId()] = [
                                    'xr'     => (float)number_format(
                                        1 / $pair->getPaymentRate(),
                                        6,
                                        '.',
                                        ''
                                    ),
                                    'cities' => ['KIEV']
                                ];
                            } else {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId()] = [
                                    'xr'     => -(float)number_format(
                                        $pair->getPaymentRate(),
                                        6,
                                        '.',
                                        ''
                                    ),
                                    'cities' => ['KIEV']
                                ];
                            }
                        } else {
                            if (number_format(
                                    $pair->getPaymentRate(),
                                    6,
                                    '.',
                                    ''
                                ) < 1) {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId(
                                )] = (float)number_format(
                                    1 / $pair->getPaymentRate(),
                                    6,
                                    '.',
                                    ''
                                );
                            } else {
                                $data['exchange'][$pair->getPayment()->getId()]['to'][$pair->getPayout()->getId(
                                )] = -(float)number_format(
                                    $pair->getPaymentRate(),
                                    6,
                                    '.',
                                    ''
                                );
                            }
                        }
                        $data['exchange'][$pair->getPayment()->getId()]['min'] =
                            (float)number_format($pair->getPayment()->getMin(), 2, '.', '');
                        $data['exchange'][$pair->getPayment()->getId()]['max'] =
                            (float)number_format($pair->getPayment()->getMax(), 2, '.', '');
                        if ($pair->getPayment()->getFee()->getConstant()) {
                            $data['currencies']['fees'][$pair->getPayment()->getId()] = [
                                'in'  => $pair->getPayment()->getFee()->getConstant(),
                            ];
                        }
                        if ($pair->getPayout()->getFee()->getConstant()) {
                            $data['currencies']['fees'][$pair->getPayout()->getId()] = [
                                'out' => $pair->getPayout()->getFee()->getConstant()
                            ];
                        }
                    }
                    break;
            }
            if ($pair->getPayout()->getBalance()) {
                $data['currencies']['amounts'][$pair->getPayout()->getId()] = (float)number_format(
                    $pair->getPayout()->getBalance(),
                    2,
                    '.',
                    ''
                );
            }
        }

        return $data;
    }

    /**
     * @param $pairs
     * @param $xml
     * @return mixed
     */
    public function EstandartsXml($pairs, $xml)
    {
        foreach ($pairs as $pair) {
            Limits::calculateMax($pair);
            Limits::calculateMin($pair);
            switch ($pair->getPayment()->getCurrency()->getTag()) {
                case Currency::TYPE_CRYPTO :
                    {
                        $track = $xml->addChild('item');
                        $track->addChild('from', $this->tetherAsset($pair->getPayment()->getCurrency()->getAsset()));
                        $track->addChild(
                            'to',
                            $pair->getPayout()->getPaymentSystem()->getTag() . '' . $pair->getPayout()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('in', 1);
                        $track->addChild(
                            'out',
                            number_format(
                                $pair->getPaymentRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild(
                            'fromfee',
                            number_format(
                                $pair->getPayment()->getFee()->getConstant() * $pair->getPaymentRate(),
                                2,
                                '.',
                                ''
                            )
                            . ' ' . $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild('tofee',
                                         $pair->getPayout()->getFee()->getConstant() . ' ' . $pair->getPayout(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax() * $pair->getPaymentRate(), 2, '.', '') . ' ' .
                            $pair->getPayout()->getCurrency()->getAsset()
                        );
                    }
                    break;
                case Currency::TYPE_CURRENCY:
                    {
                        $track = $xml->addChild('item');
                        $track->addChild(
                            'from',
                            $pair->getPayment()->getPaymentSystem()->getTag() . '' . $pair->getPayment()->getCurrency(
                            )->getAsset()
                        );
                        $track->addChild('to', $this->tetherAsset($pair->getPayout()->getCurrency()->getAsset()));
                        $track->addChild(
                            'in',
                            number_format(
                                $pair->getPayoutRate(),
                                6,
                                '.',
                                ''
                            )
                        );
                        $track->addChild('out', 1);
                        $track->addChild('amount', number_format($pair->getPayout()->getBalance(), 2, '.', ''));
                        $track->addChild('fromfee',
                                         $pair->getPayment()->getFee()->getConstant() . ' ' . $pair->getPayment(
                                         )->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'tofee',
                            number_format(
                                $pair->getPayout()->getFee()->getConstant() * $pair->getPayoutRate(),
                                2,
                                '.',
                                ''
                            ) . ' ' . $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'minamount',
                            number_format($pair->getPayment()->getMin(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                        $track->addChild(
                            'maxamount',
                            number_format($pair->getPayment()->getMax(), 2, '.', '') . ' ' .
                            $pair->getPayment()->getCurrency()->getAsset()
                        );
                    }
                    break;
            }
        }

        return $xml;
    }
}