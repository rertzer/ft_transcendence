# ft_transcendence
A website for the mighty Pong contest

# Maxence

To do, game avec waiting room. 

## Dans la partie back : 

il faudrait une fonction pour demander au backend un identifiant de room sur laquelle deux joueurs peuvent se connecter.
==> Creer une nouvelle room de type basique ou advance. 
==> envoie moi l'identifiant de cette room. 

une fonction pour rejoindre une room dont on connait l'id. Cette fonction existe deja. Voir avec Thibaut et Pierrick pour le faire fonctionner. 

une fonction pour dire je veux faire une partie advance ou basic mais j'ai pas de mates. Du coup on attend le temps que qqun se connecte. 

## Cote Front : 
### Quand on arrive sur la page. 
- Si j'ai deja un id de room, et un type de jeu, je peux afficher le game, avec un message pour dire qu'on attends le mate. 
On peut aussi indiquer si on est sur un jeu basic ou advance. 

- Si j'ai pas de type de jeu, je demande de le choisir. 

- Si j'ai un type de jeu, mais pas de numero de room, j'indique que je suis en attente de matching. 

