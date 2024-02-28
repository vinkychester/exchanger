<?php


namespace App\Service\FeedbackMessage;

use App\Entity\City;
use App\Entity\CityContactFieldValue;
use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Google\Client as GoogleClient;
use Google_Service_Gmail;
use Symfony\Component\Security\Core\Security;

class FeedbackMessageService
{
    /**
     * @var string
     */
    protected string $storageDir;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * @var EntityManagerInterface
     */
    private  EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager, Security $security,$storageDir)
    {
        $this->entityManager = $entityManager;
        $this->storageDir = $storageDir;
        $this->security = $security;
    }


    public function getClient()
    {
        $clientId = '577399962081-khgfakfgtqfbmnk5oo8suthc7vn20v0o.apps.googleusercontent.com';
        $secret = 'mrg8-pRj59sB2EJbsCmMee80';
        $client = new GoogleClient(['client_id' => $clientId, 'client_secret' => $secret, 'redirect_uri' => 'https://'.$_ENV['DOMAIN'].'/']);
        $client->setApplicationName('Gmail API PHP Quickstart');
        $client->setScopes(Google_Service_Gmail::GMAIL_READONLY);
        $client->setScopes(Google_Service_Gmail::GMAIL_MODIFY);
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');

        // Load previously authorized token from a file, if it exists.
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        $tokenPath = $this->storageDir.'GmailCredential/token.json';
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $client->setAccessToken($accessToken);
        }

        // If there is no previous token or it's expired.
        if ($client->isAccessTokenExpired()) {
            // Refresh the token if possible, else fetch a new one.
            if ($client->getRefreshToken()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            } else {
                // Request authorization from the user.
                $authUrl = $client->createAuthUrl();
                printf("Open the following link in your browser:\n%s\n", $authUrl);
                print 'Enter verification code: ';
                $authCode = trim(fgets(STDIN));

                // Exchange authorization code for an access token.
                $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
                $client->setAccessToken($accessToken);

                // Check to see if there was an error.
                if (array_key_exists('error', $accessToken)) {
                    throw new Exception(join(', ', $accessToken));
                }
            }
            // Save the token to a file.
            if (!file_exists(dirname($tokenPath))) {
//                dd('nema');
                mkdir(dirname($tokenPath), 0700, true);
            }
            file_put_contents($tokenPath, json_encode($client->getAccessToken()));
        }
//        dd($client);
        return $client;
    }

    /**
     * @throws Exception
     */
    public function getMessages()
    {
        $client = $this->getClient();
        $service = new Google_Service_Gmail($client);
        $user = 'me';
        $mods = new \Google_Service_Gmail_ModifyMessageRequest();
        $mods->setRemoveLabelIds(['UNREAD']);
        $messages = $service->users_messages->listUsersMessages($user, ['labelIds' => ['UNREAD', 'CATEGORY_PERSONAL', 'INBOX', 'IMPORTANT']]);
//        $messages = $service->users_messages->listUsersMessages($user);
//        dd($messages);
//        dd($service->users_messages->get($user, '1773f4a375c318aa'));
        if (count($messages) > 0) {
            foreach ($messages as $message) {
                $msg = $service->users_messages->get($user, $message->getId());
//                dump($msg);
//                dd($msg);
                $parts = $msg->getPayload()->getParts();
//                dd($parts);
//                dump($parts);
                if (count($parts) > 0) {
                    $data = $parts[1]->getBody()->getData();
                } else {
                    $data = $msg->getPayload()->getBody()->getData();
                }
                $out = str_replace('-', '+', $data);
                $out = str_replace('_', '/', $out);
                $info = array_filter($msg->getPayload()->getHeaders(), function ($var) {
                    return (mb_strtolower($var['name']) == 'subject');
                });
                $clientEmail = array_filter($msg->getPayload()->getHeaders(), function ($var) {
                    return (mb_strtolower($var['name']) == 'from');
                });
//            dd($clientEmail);
                $clientEmail = $clientEmail[array_key_first($clientEmail)]->getValue();
                preg_match_all('/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+.[a-zA-Z]{2,4}/', $clientEmail, $matches, PREG_SET_ORDER);
                $clientEmail = $matches[0][0];
                $service->users_messages->modify($user, $message->getId(), $mods);

            $this->saveMessage($info[array_key_first($info)]->getValue(), base64_decode($out), $clientEmail );
            }
        }
//        return count($messages);
    }

    public function saveMessage($info , $message, $clientEmail)
    {
//        dd($info, $clientEmail);
//        dump($info, $clientEmail);
        $info = explode('.', $info);
//        dd($info);
        $cityName = $info[1] ?? null;
        $type = $info[0];
//        dd($cityName);
//        dump($type);

//        dd(strpos($type,'Безналичный расчет.'));
//        dd(preg_match('/Безналичный расчет./', $type));
        if (preg_match('/Безналичный расчет/', $type)) {
//            dd('bank');
//            dump('bank');
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)->findOneBy(['type' => FeedbackMessage::BANK, 'email' => $clientEmail]);
//            dd($feedbackMessage);
            if ($feedbackMessage && ($feedbackMessage->getStatus() !== FeedbackMessage::WELL_DONE)){
//                dd('detail');
//                dump('bank-detail');
                $this->saveFeedbackDetail($feedbackMessage, $message);
            } else {
//                dd('messag');
//                dump('bank-message');
                $this->saveFeedbackMessage($message, $clientEmail, FeedbackMessage::BANK);
            }
        } elseif (preg_match('/Наличный расчет/', $type)) {
//            dd('cash');
//            dump('caSH');
            $city = $this->entityManager->getRepository(City::class)->findOneBy(['name' => $cityName]);
//            dd($city);
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)->findOneBy(['type' => FeedbackMessage::CASH, 'email' => $clientEmail, 'city' => $city ]);

            if ($feedbackMessage && ($feedbackMessage->getStatus() !== FeedbackMessage::WELL_DONE)) {
//                dump('cash-detail');
                $this->saveFeedbackDetail($feedbackMessage, $message);
            } else {
//                dump('cash-message');
                $this->saveFeedbackMessage($message, $clientEmail, FeedbackMessage::CASH);
            }
        } else {
//            dump('new');
//            dd('new');
            $this->saveFeedbackMessage($message, $clientEmail, FeedbackMessage::UNKNOWN);
        }

    }

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


}