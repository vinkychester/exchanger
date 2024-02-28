<?php


namespace App\Controller;


use App\Entity\Pair;
use App\Service\RateMonitoring\RateMonitoringService;
use SimpleXMLElement;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ItlabStudio\ApiClient\Service\ApiClient;

/**
 * Class RateMonitoringController
 * @package App\Controller
 * @Route("/api")
 */
class RateMonitoringController extends AbstractController
{

    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;
    /**
     * @var RateMonitoringService
     */
    protected RateMonitoringService $monitoringService;

    /**
     * RateMonitoringController constructor.
     * @param ApiClient $apiClient
     * @param RateMonitoringService $monitoringService
     */
    public function __construct(ApiClient $apiClient, RateMonitoringService $monitoringService)
    {
        $this->apiClient = $apiClient;
        $this->monitoringService = $monitoringService;
    }


    /**
     * @Route("/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function xmlRate(): Response
    {
        $cities = $this->monitoringService->getCities();
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->bestChangeXML($activePairBank, $xml);

        foreach ($cities as $city) {
            $xml = $this->monitoringService->bestChangeXML($activePairCash, $xml, $city);
        }

        return new Response($xml->asXML());
    }

    /**
     * @Route("/kurs_expert/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function kursExpertXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->kursExpertXML($activePairBank, $xml);

        $xml = $this->monitoringService->kursExpertXML($activePairCash, $xml, true);

        return new Response($xml->asXML());
    }


    /**
     * @Route("/exchange_sumo/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function exchangeSumoXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();
        $activePairs = array_merge($activePairCash, $activePairBank);

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->exchangeSumoXML($activePairs, $xml);

        return new Response($xml->asXML());
    }

    /**
     * @Route("/kurses/json/rate")
     * @return JsonResponse
     */
    public function kursesJsonRate(): JsonResponse
    {
        $data = [
            'version' => '1.3',
        ];
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();

        $data = $this->monitoringService->kursesJson($activePairBank, $data);

        $data = $this->monitoringService->kursesJson($activePairCash, $data, true);

        return new JsonResponse($data);
    }

    /**
     * @Route("/kurs/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function kursXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();
        $activePairs = array_merge($activePairCash, $activePairBank);

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->EstandartsXml($activePairs, $xml);

        return new Response($xml->asXML());
    }

    /**
     * @Route("/bits_media/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function bitsMediaXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();
        $activePairs = array_merge($activePairCash, $activePairBank);

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->EstandartsXml($activePairs, $xml);

        return new Response($xml->asXML());
    }

    /**
     * @Route("/ok_chager/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function okChangerXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();
        $activePairs = array_merge($activePairCash, $activePairBank);

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->EstandartsXml($activePairs, $xml);

        return new Response($xml->asXML());
    }

    /**
     * @Route("/x_rates/xml/rate", defaults={"_format"="xml"})
     * @return Response
     */
    public function xRatesXmlRate(): Response
    {
        $activePairCash = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitCash();
        $activePairBank = $this->getDoctrine()->getRepository(Pair::class)->getActivePairWithActivePairUnitBank();
        $activePairs = array_merge($activePairCash, $activePairBank);

        $xml = new SimpleXMLElement("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><rates></rates>");

        $xml = $this->monitoringService->EstandartsXml($activePairs, $xml);

        return new Response($xml->asXML());
    }
}