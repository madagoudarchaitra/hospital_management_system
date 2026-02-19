-- Add missing columns to tables
USE hospital_management;

-- Add columns to staffs table
ALTER TABLE staffs ADD COLUMN department VARCHAR(255);
ALTER TABLE staffs ADD COLUMN phone VARCHAR(255);
ALTER TABLE staffs ADD COLUMN email VARCHAR(255);

-- Add columns to patients table
ALTER TABLE patients ADD COLUMN name VARCHAR(255);
ALTER TABLE patients ADD COLUMN contact VARCHAR(255);

-- Verify changes
SELECT 'Columns added successfully!' as Status;
DESCRIBE staffs;
DESCRIBE patients;
