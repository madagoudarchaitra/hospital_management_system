-- Fix staffs table by adding missing columns
USE hospital_management;

-- Add missing columns if they don't exist
ALTER TABLE staffs ADD COLUMN IF NOT EXISTS department VARCHAR(255);
ALTER TABLE staffs ADD COLUMN IF NOT EXISTS phone VARCHAR(255);
ALTER TABLE staffs ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Show the updated table structure
DESCRIBE staffs;

SELECT 'Staffs table updated successfully!' as message;
