# WebservicesTP

## Mise en place de 2 micro services command et stock gérant un stock de livre.

Chaque livre peut être ajouté au panier via l'interface.

La validation du panier se fait par postman (interface en cours).

La validation passe par une file Kafka qui est déployée grâce au docker-compose situé dans le micro service stock.

**command** écrit dans le topic 'topic-test' et **stock** dépile les messages de ce même topic.


En cours : 
- **IHM cart**
- **circuit breaker**


Petit disclaimer : je n'avais pas fait de node depuis 5 ans donc le code n'est pas forcément très beau ni optimisé l'idée était plus de comprendre le fonctionnement et l'implémentation micro service/message queue.
