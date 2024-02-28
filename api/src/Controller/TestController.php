<?php


namespace App\Controller;


use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{

    /**
     * @Route("/api/test", name="test")
     */
    public function index(): Response
    {
        $requisition = $this->getDoctrine()->getRepository(Requisition::class)->findAll()[0];
        $requisitionFeeHistory = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)->findOneBy([
            'type' => "payment", 'requisition' => $requisition
        ]);

        return $this->render(
            'emails/requisition_payout.html.twig',
            ['requisition' => $requisition, 'requisitionFeeHistory' => $requisitionFeeHistory]
        );
    }
}