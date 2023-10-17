sleep 10
yarn prisma migrate dev --name init
sleep 20
exec nest start --watch
