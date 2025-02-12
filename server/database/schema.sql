create table user (
  id int unsigned primary key auto_increment not null,
  email varchar(255) not null unique,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  occupation varchar(255) not null,
  hashed_password varchar(255) not null
);

create table schedule (
  id int unsigned primary key auto_increment not null,
  user_id int unsigned not null,
  start_time datetime not null,
  end_time datetime not null,
  subject varchar(255) not null,
  description text not null,
  location varchar(255) not null,
  foreign key (user_id) references user(id)
);

create table invitation (
  id int unsigned primary key auto_increment not null,
  schedule_id int unsigned not null,
  user_id int unsigned not null,
  status enum('pending', 'accepted', 'declined') not null,
  foreign key (schedule_id) references schedule(id),
  foreign key (user_id) references user(id)
);
