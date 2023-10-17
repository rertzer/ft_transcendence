FROM	debian:bullseye


RUN sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
RUN apt-get update

# Install the latest version of PostgreSQL.
# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
RUN apt-get -y install postgresql

RUN mkdir -p /var/run/mysqld && chown -R mysql:mysql /var/run/mysqld && chmod 755 /var/run/mysqld
COPY	./conf/50-server.cnf /etc/postgresql/14/main/50-server.cnf
COPY	./tools/init_mariadb.sh /usr/local/bin/init_mariadb.sh
RUN	chmod 755 /usr/local/bin/init_mariadb.sh

EXPOSE 3306

ENTRYPOINT ["sh", "/usr/local/bin/init_mariadb.sh"]

CMD ["mysqld_safe", "--datadir=/var/lib/mysql"]
