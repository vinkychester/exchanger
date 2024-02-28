<?php


namespace App\Controller;


use App\Entity\Fee;
use App\Entity\PairUnit;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ChangeFeeCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class ChangeFeeCallbackController extends AbstractController
{
    /**
     * @Route("/change-fee", name="change_fee_callback")
     * @param Request $request
     * @return Response
     * @throws NonUniqueResultException
     */
    public function changeFeeCallback(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);
        $data = $content['data'];
        $baseFee = $data['baseFee'];

        file_get_contents(
            "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
            'UPDATE FEE CALLBACK ' . $_ENV['DOMAIN']
        );

        /** @var PairUnit $pairUnit */
        try {
            $pairUnit = $this->getDoctrine()->getRepository(PairUnit::class)->findPairUnit(
                $baseFee,
                $baseFee['feeType']['name']
            );
        } catch (\Exception $exception) {
            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                'ERROR ' . $exception->getMessage() . ' direction - ' . $baseFee['feeType']['name'] . ' asset - ' . $baseFee["currency"]["asset"] . ' service_name  - '
                . $baseFee["service"]["name"] . ' payment_system_name - ' . $baseFee["paymentSystem"]["name"]
            );
        }

        if ($pairUnit) {
            /** @var Fee $fee */
            $fee = $pairUnit->getFee();

            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                'PAIR_UNIT ' . $pairUnit->getId() . ' ' . $pairUnit->getCurrency()->getAsset()
            );

            $fee->setConstant($data['constant']);
            $fee->setPercent($data['percent'] * 100);
            $fee->setMin($data['min']);
            $fee->setMax($data['max']);

            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                'FEE ' . $fee->getConstant() . ' ' . $fee->getPercent() . ' min - ' . $fee->getMin() . ' max -' . $fee->getMax()
            );

            $this->getDoctrine()->getManager()->flush();
        }

        return new Response('', 200);
    }
    
}
