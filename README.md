# ft_transcendence
A website for the mighty Pong contest

## Notes pour Maxence
Besoin de reprendre ici :
https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

et video pour la partie socket.io et React https://youtu.be/aA_SdbGD64E?si=acjJV02N0BNWz0Ro&t=5763

et pour la partie backend Socket.io sur NestJS https://youtu.be/fBtNgqIu63g?si=_IGrSHtJLkuyP80R&t=701

#resize. 

Besoin de travailler en % sur les x pour que ca puisse fonctionner quand on resize le gameheight.  et gerer aussi le y. 


## Logique Game socket Maxence
Quand le player clique sur rejoindre une room, je dois le connecter au server et envoyer : 
- Le numero de la room qu'il veut et son nom. 

Le serveur recoit cette demande, creer le Player de son cote avec les infos qu'il a. Regarde si une room avec le meme identifiant existe.
- Si oui, il ajoute le client a la room et lui renvoie un message pour lui dire : 'OK c'est good tu peux jouer' et avec les infos suivantes : Tu es de tel cote, ton adversaire s'appelle truc much.
Quand le client a recu ces infos, la partie peut commencer.
- Si aucune room n'existe avec l'id donne. Le serveur va creer une room, et y ajouter le client. Puis envoyer un message au client pour lui dire, tu es en attente d'un autre client. 


- Si autre client se connecte sur le room qui a ete cree, un message est envoye aux deux clients pour leur dire GOGOGO. 

si un client se deconnecte. => Si il est seul dans la room, elle est supprime. Si il est pas seul, la partie est remise a zero, un message est envoye au client qui reste, et on attend qu'un autre client arrive. 