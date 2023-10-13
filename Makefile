# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mbocquel <mbocquel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/08/01 17:12:15 by mbocquel          #+#    #+#              #
#    Updated: 2023/10/13 14:08:49 by mbocquel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SOURCES = 	docker-compose.yml

all: 	$(SOURCES)
		docker-compose -f ./docker-compose.yml up

down:	$(SOURCES)
		docker-compose -f ./docker-compose.yml down

clean:	$(SOURCES)
		docker-compose -f ./docker-compose.yml down -v
		
fclean:	clean
		docker system prune -af

re:		fclean all

.PHONY: all re down clean