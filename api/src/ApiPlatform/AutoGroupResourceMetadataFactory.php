<?php


namespace App\ApiPlatform;


use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;

class AutoGroupResourceMetadataFactory implements ResourceMetadataFactoryInterface
{

    public function create(string $resourceClass): ResourceMetadata
    {
        // TODO: Implement create() method.
    }
}