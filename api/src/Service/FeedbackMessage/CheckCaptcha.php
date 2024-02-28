<?php


namespace App\Service\FeedbackMessage;


use GuzzleHttp\Client;

class CheckCaptcha
{


    /**
     * @param $value
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function checkCaptcha($value)
    {
        $client = new Client();

        $response = $client->post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'query' => [
                    'secret'   => $_ENV['REACT_APP_GOOGLE_RECAPTCHA_SECRET'],
                    'response' => $value
                ]
            ]
        );

        return json_decode($response->getBody())->success;
    }


}