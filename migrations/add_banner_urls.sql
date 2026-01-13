-- Add banner URL columns to system_settings table
ALTER TABLE system_settings 
ADD COLUMN IF NOT EXISTS banner_desktop_url TEXT DEFAULT '/img/banner-desktop.jpg',
ADD COLUMN IF NOT EXISTS banner_mobile_url TEXT DEFAULT '/img/banner-mobile.jpg';

-- Update existing row if exists
UPDATE system_settings 
SET banner_desktop_url = COALESCE(banner_desktop_url, '/img/banner-desktop.jpg'),
    banner_mobile_url = COALESCE(banner_mobile_url, '/img/banner-mobile.jpg')
WHERE id = 1;
