<?php


namespace App\Service\FeedbackMessage;


use App\Entity\City;
use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use Doctrine\ORM\EntityManagerInterface;
use DOMDocument;
use PhpImap\Mailbox as ImapMailbox;
use Symfony\Component\Security\Core\Security;


/**
 * Class ParseEmail
 * @package App\Service\FeedbackMessage
 */
class ParseEmail
{

    /**
     * @var ImapMailbox
     *
     */
    protected $mailbox;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * @var array|string[]
     */
    protected array $problem_services = [
        'yandex.ru'   => ['parseHtmlYandex', 'textHtml'],
        'ya.ru'       => ['parseHtmlYandex', 'textHtml'],
        'outlook.com' => ['outlook', 'textPlain'],
        'hotmail.com' => ['outlook', 'textPlain'],
        'meta.ua'     => ['metaUa', 'textPlain'],
        'online.ua'   => ['parseHtmlOnline', 'textHtml'],
        'ukr.net'     => ['parseHTML', 'textHtml']
    ];

    /**
     * ParseEmail constructor.
     * @param EntityManagerInterface $entityManager
     * @param Security $security
     * @throws \PhpImap\Exceptions\InvalidParameterException
     */
    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->mailbox = new ImapMailbox(
            "{185.141.192.66:143/imap/tls/novalidate-cert}INBOX",
             $_ENV['PROD_LOGIN'],
            $_ENV['PROD_PASSWORD']
        );
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @return int[]
     */
    public function getListOfMails()
    {
        $mailsIds = $this->mailbox->searchMailbox('UNSEEN');
        if ($mailsIds) {
            foreach ($mailsIds as $id) {
                $mail = $this->mailbox->getMail($id);
                $message = $this->checkEmail($mail->fromAddress, $mail);
                $this->saveMessage($mail->subject, $message, $mail->fromAddress);
            }
            $this->mailbox->disconnect();
        }

        return $mailsIds;
    }

    /**
     * @param $info
     * @param $message
     * @param $clientEmail
     */
    public function saveMessage($info, $message, $clientEmail)
    {
        $info = explode('.', $info);
        $cityName = null;
        if (count($info) > 1) {
            $cityName = explode(':', $info[1])[1];
        }
        $type = $info[0];

        if (preg_match('/Безналичный расчет/', $type) || preg_match('/Безналичный_расчет/', $type)) {
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)->findOneBy(
                ['type' => FeedbackMessage::BANK, 'email' => $clientEmail]
            );
            if ($feedbackMessage && ($feedbackMessage->getStatus() !== FeedbackMessage::WELL_DONE)) {
                $this->saveFeedbackDetail($feedbackMessage, $message);
            } else {
                $this->saveFeedbackMessage($message, $clientEmail, FeedbackMessage::BANK);
            }
        }
        if (preg_match('/Наличный расчет/', $type) || preg_match('/Наличный_расчет/', $type)) {
            $city = $this->entityManager->getRepository(City::class)->findOneBy(['name' => $cityName]);
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)->findOneBy(
                ['type' => FeedbackMessage::CASH, 'email' => $clientEmail, 'city' => $city]
            );

            if ($feedbackMessage && ($feedbackMessage->getStatus() !== FeedbackMessage::WELL_DONE)) {
                $this->saveFeedbackDetail($feedbackMessage, $message);
            } else {
                $this->saveFeedbackMessage($message, $clientEmail, FeedbackMessage::CASH);
            }
        }
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHTML($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->substituteEntities = true;
        $dom->encoding = 'UTF-8';
        $dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $dom->encoding = 'UTF-8';
        $dom->saveXML();
        $spans = $dom->getElementsByTagName('span');
        $message = '';
        foreach ($spans as $span) {
            $message .= $span->textContent;
        }

        return $this->onlyText($message);
    }


    /**
     * @param $string
     * @return string
     */
    private function onlyText($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/\b[^\s]+@[^\s]+/', $line)) {
                break;
            }
            $message[] = $line;

        }

        return implode(PHP_EOL, $message);
    }

    /**
     * @param $feedbackMessage
     * @param $message
     */
    private function saveFeedbackDetail($feedbackMessage, $message)
    {
        $feedbackDetail = new FeedbackDetail();
        $feedbackDetail->setFeedbackMessage($feedbackMessage);
        $feedbackDetail->setMessage($message);
        $feedbackDetail->setAuthor(FeedbackDetail::Client);
        $feedbackMessage->setStatus(FeedbackMessage::NOT_VIEWED);
        $this->entityManager->persist($feedbackMessage);
        $this->entityManager->persist($feedbackDetail);
        $this->entityManager->flush();
    }

    /**
     * @param $message
     * @param $clientEmail
     * @param $typeMessage
     */
    private function saveFeedbackMessage($message, $clientEmail, $typeMessage)
    {
        $feedbackMessageNew = new FeedbackMessage();
        $feedbackMessageNew->setMessage($message);
        $feedbackMessageNew->setType($typeMessage);
        $feedbackMessageNew->setEmail($clientEmail);
        $feedbackMessageNew->setFirstname('пользователь');
        $feedbackMessageNew->setLastname('Незарегистрированный');
        $this->entityManager->persist($feedbackMessageNew);
        $this->entityManager->flush();
    }

    /**
     * @param $email
     * @param $mail
     * @return string
     */
    private function checkEmail($email, $mail): string
    {
        if (array_key_exists(explode('@', $email)[1], $this->problem_services)){
            $method = $this->problem_services[explode('@', $email)[1]][0];
            $methodEmail = $this->problem_services[explode('@', $email)[1]][1];
            $message = $this->$method($mail->$methodEmail);
        } else {
            $message = $this->onlyText($mail->textPlain);
        }

        return $message;
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHtmlYandex($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $divs = $dom->getElementsByTagName('div');
        $message = $divs[0]->textContent;

        return $this->onlyText($message);
    }

    /**
     * @param $string
     * @return string
     */
    private function metaUa($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/i$/', $line)) {
                break;
            }
            $message[] = $line;
        }

        return mb_convert_encoding(implode(PHP_EOL, $message),'UTF-8', 'windows-1251');
    }

    /**
     * @param $string
     * @return string
     */
    private function outlook($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/\b[^\s]+@[^\s]+/', $line)) {
                break;
            }
            $message[] = $line;
        }

        return mb_convert_encoding(implode(PHP_EOL, $message),'UTF-8', 'koi8-u');
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHtmlOnline($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->substituteEntities = true;
        $dom->encoding = 'UTF-8';
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $dom->encoding = 'UTF-8';
        $dom->saveXML();
        $spans = $dom->getElementsByTagName('span');
        $ps = $dom->getElementsByTagName('p');
        $message = '';
        foreach ($spans as $span) {
            $message .= $span->textContent;
        }
        foreach ($ps as $p) {
            $message .= $p->textContent;
        }

        return $this->onlyText($message);
    }

}