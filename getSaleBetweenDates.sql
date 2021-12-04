SELECT o.order_id, 
o.order_amount, 
r.retailer_id, 
d.distributor_id, 
r.name AS retailer_name, 
d.name AS distributor_name, 
r.location, r.pincode,
o.createdAt  
FROM orders o INNER JOIN retailers r ON
o.client_id = r.retailer_id INNER JOIN distributors d ON
d.distributor_id = o.distributor_id
WHERE 
CAST(o.createdAt AS DATETIME) 
BETWEEN CAST('2021-12-02 14:15:55' AS DATETIME) 
AND 
CAST('2021-12-04 14:15:55' AS DATETIME);
