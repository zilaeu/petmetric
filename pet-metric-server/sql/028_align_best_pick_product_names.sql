/* Keep editorial copy aligned with the verified product names shown by the catalog. */
SET NAMES utf8mb4;

UPDATE best_picks
SET content_json = CAST(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(CAST(content_json AS CHAR), 'Fi Series 3', 'Tractive Smart Dog GPS Tracker'),
                'Whistle GO Explore', 'Life360 Pet GPS Tracker for Dogs'
              ),
              'PETKIT PURA X', 'PETLIBRO Luma Automatic Litter Box'
            ),
            'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'
          ),
          'PETLIBRO Granary', 'PETLIBRO Granary 5L Automatic Feeder'
        ),
        'Petcube Bites 2', 'Petcube Bites 2 Lite Cam Bundle'
      ),
      'Furbo 360', 'Furbo 360 Dog Camera'
    ),
    'PetSafe ScoopFree', 'PetSafe ScoopFree Crystal Pro Legacy'
  ) AS JSON
)
WHERE slug IN (
  'best-automatic-litter-box-multiple-cats',
  'best-gps-tracker-escape-prone-dogs',
  'best-pet-feeder-portion-control',
  'best-pet-camera-separation-anxiety',
  'best-automatic-litter-box-small-spaces',
  'best-gps-tracker-international-travel',
  'best-smart-feeder-simple-schedules',
  'best-pet-camera-treat-interaction'
);
