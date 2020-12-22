CREATE TABLE produtos
(
  codigo serial NOT NULL PRIMARY KEY,
  nome varchar(50) NOT NULL,
  preco numeric(10,2) NOT NULL,
  estoque integer NOT NULL
);


insert into produtos (nome, preco, estoque) values ('Mouse sem fio', 200.00, 40), ('Teclado sem fio', 250.00, 40);

create table usuarios (
nome_usuario varchar(30) not null primary key, 
senha varchar(20) not null);

insert into usuarios (nome_usuario, senha) values ('jorge' , '1234'), ('joao', '1234');
