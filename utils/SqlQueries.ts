export const postQuery = `SELECT time_slots.time_slot, COUNT(post.created_at) AS post_count
FROM (
    SELECT DISTINCT DATE_FORMAT(
        DATE_SUB(NOW(), INTERVAL (units.a + tens.a + hundreds.a + thousands.a) MINUTE),
        '%Y-%m-%d %H:%i'
    ) AS time_slot
    FROM (
        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) units
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL SELECT 50) tens
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 100) hundreds
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1000) thousands
    WHERE (units.a + tens.a + hundreds.a + thousands.a) <= 60
) AS time_slots
LEFT JOIN post ON DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i') = time_slots.time_slot
GROUP BY time_slots.time_slot
ORDER BY time_slots.time_slot DESC;
`;

export const userQuery = `SELECT time_slots.time_slot, COUNT(user.created_at) AS post_count
FROM (
    SELECT DISTINCT DATE_FORMAT(
        DATE_SUB(NOW(), INTERVAL (units.a + tens.a + hundreds.a + thousands.a) MINUTE),
        '%Y-%m-%d %H:%i'
    ) AS time_slot
    FROM (
        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) units
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL SELECT 50) tens
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 100) hundreds
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1000) thousands
    WHERE (units.a + tens.a + hundreds.a + thousands.a) <= 60
) AS time_slots
LEFT JOIN user ON DATE_FORMAT(user.created_at, '%Y-%m-%d %H:%i') = time_slots.time_slot
GROUP BY time_slots.time_slot
ORDER BY time_slots.time_slot DESC;
`;
