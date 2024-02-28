<?php


namespace App\Filter;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\FeedbackMessage;
use Doctrine\ORM\QueryBuilder;

class CityFeedbackMessageFilter extends AbstractContextAwareFilter
{

    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {

        if (
            !$this->isPropertyEnabled($property, $resourceClass) ||
            !$this->isPropertyMapped($property, $resourceClass)
        ) {
            return;
        }
//        dd($property, $value);

        $parameterName = $queryNameGenerator->generateParameterName($property);
        $queryBuilder
            ->andWhere('o.city = :value')
            ->setParameter('value', $value);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[$property] = [
                'property' => $property,
                'type' => 'bool',
                'required' => true,
            ];
        }

        return $description;
    }
}