with ajoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ) 
  Select 
    a.date_f, 
    count(distinct a.PHONE) as step_1 
  from 
    a 
  group by 
    a.date_f
), 
abjoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_2 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed
), 
abcjoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  c as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_add_to_cart 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_add_to_cart 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic add to cart' 
          AND S10 IN (
            'Listing page', 'Test Detail Page'
          ) 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_3 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
    left join c on a.PHONE = c.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and c.diagnostic_add_to_cart is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed 
    and b.diagnostic_product_listing_test_page_viewed < c.diagnostic_add_to_cart
), 
abcdjoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  c as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_add_to_cart 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_add_to_cart 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic add to cart' 
          AND S10 IN (
            'Listing page', 'Test Detail Page'
          ) 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  d as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_patient_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_patient_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic patient selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_4 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
    left join c on a.PHONE = c.PHONE 
    left join d on a.PHONE = d.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and c.diagnostic_add_to_cart is not null 
    and d.diagnostic_patient_selected is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed 
    and b.diagnostic_product_listing_test_page_viewed < c.diagnostic_add_to_cart 
    and c.diagnostic_add_to_cart < d.diagnostic_patient_selected
), 
abcdejoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  c as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_add_to_cart 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_add_to_cart 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic add to cart' 
          AND S10 IN (
            'Listing page', 'Test Detail Page'
          ) 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  d as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_patient_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_patient_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic patient selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  e as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_slot_time_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_slot_time_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic slot time selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_5 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
    left join c on a.PHONE = c.PHONE 
    left join d on a.PHONE = d.PHONE 
    left join e on a.PHONE = e.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and c.diagnostic_add_to_cart is not null 
    and d.diagnostic_patient_selected is not null 
    and e.diagnostic_slot_time_selected is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed 
    and b.diagnostic_product_listing_test_page_viewed < c.diagnostic_add_to_cart 
    and c.diagnostic_add_to_cart < d.diagnostic_patient_selected 
    and d.diagnostic_patient_selected < e.diagnostic_slot_time_selected
), 
abcdefjoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  c as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_add_to_cart 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_add_to_cart 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic add to cart' 
          AND S10 IN (
            'Listing page', 'Test Detail Page'
          ) 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  d as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_patient_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_patient_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic patient selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  e as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_slot_time_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_slot_time_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic slot time selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  f as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_order_placed_backend 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_order_placed_backend 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'diagnostic order placed backend' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_6 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
    left join c on a.PHONE = c.PHONE 
    left join d on a.PHONE = d.PHONE 
    left join e on a.PHONE = e.PHONE 
    left join f on a.PHONE = f.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and c.diagnostic_add_to_cart is not null 
    and d.diagnostic_patient_selected is not null 
    and e.diagnostic_slot_time_selected is not null 
    and f.diagnostic_order_placed_backend is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed 
    and b.diagnostic_product_listing_test_page_viewed < c.diagnostic_add_to_cart 
    and c.diagnostic_add_to_cart < d.diagnostic_patient_selected 
    and d.diagnostic_patient_selected < e.diagnostic_slot_time_selected 
    and e.diagnostic_slot_time_selected < f.diagnostic_order_placed_backend
), 
abcdefgjoin as (
  with a as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_landing_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_landing_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic landing page viewed' 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank = 1
  ), 
  b as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_product_listing_test_page_viewed 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_product_listing_test_page_viewed 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME IN (
            'Diagnostic product listing page viewed', 
            'Diagnostic test page viewed'
          ) 
          AND date(TSPARSED) = CURRENT_DATE - 1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  c as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_add_to_cart 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_add_to_cart 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic add to cart' 
          AND S10 IN (
            'Listing page', 'Test Detail Page'
          ) 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  d as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_patient_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_patient_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic patient selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  e as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_slot_time_selected 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_slot_time_selected 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'Diagnostic slot time selected' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ), 
  f as (
    SELECT 
      date_f, 
      PHONE, 
      diagnostic_order_placed_backend 
    FROM 
      (
        SELECT 
          PHONE, 
          date(TSPARSED) AS date_f, 
          row_number() OVER (
            PARTITION BY PHONE 
            ORDER BY 
              TSPARSED ASC
          ) AS rank, 
          TSPARSED AS diagnostic_order_placed_backend 
        FROM 
          `CLEVERTAP.CT_EVENTS` 
        WHERE 
          EVENTNAME = 'diagnostic order placed backend' 
          AND date(TSPARSED) = CURRENT_DATE()-1
      ) 
    WHERE 
      rank between 1 
      and 10
  ) 
  Select 
    count(distinct a.PHONE) as step_7 
  from 
    a 
    left join b on a.PHONE = b.PHONE 
    left join c on a.PHONE = c.PHONE 
    left join d on a.PHONE = d.PHONE 
    left join e on a.PHONE = e.PHONE 
    left join f on a.PHONE = f.PHONE 
  where 
    a.diagnostic_landing_page_viewed is not null 
    and b.diagnostic_product_listing_test_page_viewed is not null 
    and c.diagnostic_add_to_cart is not null 
    and d.diagnostic_patient_selected is not null 
    and e.diagnostic_slot_time_selected is not null 
    and f.diagnostic_order_placed_backend is not null 
    and a.diagnostic_landing_page_viewed < b.diagnostic_product_listing_test_page_viewed 
    and b.diagnostic_product_listing_test_page_viewed < c.diagnostic_add_to_cart 
    and c.diagnostic_add_to_cart < d.diagnostic_patient_selected 
    and d.diagnostic_patient_selected < e.diagnostic_slot_time_selected 
    and e.diagnostic_slot_time_selected < f.diagnostic_order_placed_backend
)
