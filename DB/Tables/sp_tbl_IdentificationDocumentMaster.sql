DROP PROCEDURE IF EXISTS sp_tbl_IdentificationDocumentMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_IdentificationDocumentMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_IdentificationDocumentMaster'
        ) THEN

        CREATE TABLE IF NOT EXISTS `tbl_IdentificationDocumentMaster` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `document_holder_id` int(11) DEFAULT NULL,
		  `document_holder_type` varchar(250) DEFAULT NULL,
		  `document_type` varchar(250) DEFAULT NULL,
		  `document_id_number` varchar(100) DEFAULT NULL,
		  `is_active` tinyint(4) NOT NULL DEFAULT '1',
		  `created_by` int(11) NOT NULL,
		  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		  `modified_by` int(11) DEFAULT NULL,
		  `modified` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `document_id_number` (`document_id_number`)
		) ;
    end if;
end$$

DELIMITER ;
CALL sp_tbl_IdentificationDocumentMaster();
DROP PROCEDURE IF EXISTS sp_tbl_IdentificationDocumentMaster;