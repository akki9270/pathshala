use PATHSHALA;
set FOREIGN_KEY_CHECKS = 0;
ALTER TABLE `sutra`
ADD COLUMN `category_id` INT NOT NULL,
ADD FOREIGN KEY (category_id) REFERENCES sutra(id);
UPDATE `sutra` SET category_id = 1 WHERE id > 0;
set FOREIGN_KEY_CHECKS = 1;

INSERT INTO PATHSHALA.user (`id`,`first_name`, `role`, `createdAt`, `updatedAt`) values(10001,'Admin','Admin', now(), now());

ALTER TABLE `PATHSHALA`.`sutra` 
CHANGE COLUMN `queue_number` `queue_number` INT(11) NULL ;
