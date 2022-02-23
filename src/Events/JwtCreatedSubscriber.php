<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function jwtDatas(JWTCreatedEvent $event) {
        // Récupérer l'utilisateur
        // annotation pour desactiver erreur Intelephense
        /** @var UserRepository */
        $user = $event->getUser();
        
        // Enrichir les datas
        $datas = $event->getData();
        $datas['firstName'] = $user->getFirstName();
        $datas['lastName'] = $user->getLastName();

        $event->setData($datas);
    }
}