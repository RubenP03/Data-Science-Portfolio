use sakila

# 1a. Display first and last names of all actors
SELECT  first_name, last_name 
FROM actor

# 1b. Display first and last name of each actor in single column in upper case
SELECT UPPER (concat(first_name, last_name)) AS 'Actor Name'
FROM actor;

# 2a. Find ID, first name, last name or an actor. 
SELECT first_name, last_name, ACTOR_ID
FROM actor 
WHERE first_name = 'Joe';

# 2b. Find all actors whose last name contain "GEN"
SELECT first_name, last_name, ACTOR_ID
FROM actor
WHERE last_name = '%gen%'; 

# 2c. Find all actors whose last names contin the letters "li"
SELECT first_name, last_name, ACTOR_ID
FROM actor
WHERE last_name = '%li%'; 

#2d. Using "IN" display country id and country columns of Afghanistan, Bangladesh and China
SELECT country_id, country
FROM country
WHERE country IN ("Afghanistan", "Bangladesh", "China");

#3a. keep desc. of each actor. create colunm in in 'actor' table named 'description' and use the "BLOB" data type 
# significant difference between BLOB and VARCHAR
ALTER TABLE actor
ADD COLUMN description VARCHAR(45) AFTER first_name;
#select description from actor;

ALTER TABLE actor
MODIFY COLUMN description BLOB; 
#select description from actor;

#3b. delete description column
ALTER TABLE actor
DROP COLUMN description;

#4a. list LAST names of actors as well as how many have that LAST name
SELECT last_name, count(last_name) AS "last_name_amt" 
FROM actor
GROUP BY last_name
HAVING "last_name_amt" >=1;

# 4b. List LAST names of actors who have that last name but only shared by 2 actors
SELECT last_name, count(last_name) AS "last_name_amt" 
FROM actor
GROUP BY last_name
HAVING "last_name_amt" >=2;

#4c. actor "Harpo Williams" accidentally entered as actor "Groucho Williams" Fix this error. 
UPDATE actor
SET first_name = "HARPO"
WHERE first_name = "GROUCHO"
AND last_name = "WILLIAMS";

#4d. change name back from "Groucho" to "Harpo"
UPDATE actor
SET first_name = "GROUCHO"
WHERE first_name = "HARPO"
AND last_name = "WILLIAMS";

#5a. locate schema of address table
SHOW CREATE TABLE address;

#6a. use JOIN to display first and last names, address of each staff member (staff and address tables)
SELECT s.first_name, s.last_name, a.address
FROM staff s
INNER JOIN address a
ON (s.address_id=a.address_id); 

#6b. use JOIN to display total amount rung up by each staff member in aug 2005 (staff and payment tables)
SELECT s.first_name, s.last_name, SUM(p.amount)
FROM staff AS s
INNER JOIN payment AS p
ON p.staff_id=s.staff_id
WHERE MONTH(p.payment_date)=08 AND YEAR(p.payment_date)=2005
GROUP BY s.staff_id;

# 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use INNER JOIN.
SELECT f.title, COUNT(fa.actor_id) AS 'Actors'
FROM film_actor AS fa
INNER JOIN film as f
ON f.film_id=fa.film_id
GROUP BY f.title
ORDER BY Actors desc;

# 6d. How many copies of the film Hunchback Impossible exist in the inventory system? use film and inventory tables
SELECT title, COUNT(inventory_id) AS 'No. of copies'
FROM film
INNER JOIN inventory
WHERE title = "Hunchback Impossible"
GROUP BY title;

# 6e. Using the tables PAYMENT and CUSTOMER and the JOIN command, list the total paid by each customer. 
# List the customers alphabetically by last name:
SELECT c.first_name, c.last_name, SUM(p.amount) AS "Tot. paid by customer"
FROM payment AS p
INNER JOIN customer as c
ON p.customer_id=c.customer_id
GROUP BY c.customer_id
ORDER BY c.last_name;

# 7a. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English. (use film and language)
SELECT title
FROM film
WHERE title like 'K%' 
OR title like 'Q%'
and language_id IN
(SELECT language_id
FROM language
WHERE name ='English');

# 7b. Use subqueries to display all actors who appear in the film Alone Trip. (use actor and film)
SELECT first_name, last_name
FROM actor
WHERE actor_id IN
(SELECT actor_id
FROM film_actor
WHERE film_id=
(SELECT film_id
FROM film
WHERE title = 'Alone Trip'));

#7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. 
#Use joins to retrieve this information. 
SELECT first_name, last_name, email, country
FROM customer cus
INNER JOIN address 
ON (cus.address_id=a.address_id)
INNER JOIN city cit
ON(a.city_id=cit.city_id)
INNER JOIN country ctr
ON (cit.country_id=ctr.country_id)
WHERE ctr.country_= 'canada';

# 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion.
#Identify all movies categorized as family films. (use film and film_category tables)
SELECT title, c.name
FROM film f
INNER JOIN film_category fc
ON (f.film_id=fc.film_id)
INNER JOIN category c
ON (c.category_id=fc.category_id)
WHERE name = 'family';

# 7e. Display the most frequently rented movies in descending order.
SELECT title, COUNT(title) as 'Rentals'
FROM film
INNER JOIN inventory
ON (film.film_id=inventory.film_id)
INNER JOIN rental
ON (inventory.inventory_id=rental.inventory_id)
GROUP BY title
ORDER BY rentals desc;

#7f. Write a query to display how much business, in dollars, each store brought in.
SELECT s.store_id, SUM(amount) AS Gross
FROM payment p
INNER JOIN rental r
ON (p.rental_id=r.rental_id)
INNER JOIN inventory i 
ON (i.inventory_id=r.inventory_id)
INNER JOIN store s 
ON(s.store_id=i.store_id)
group by s.store_id;

# 7g. Write a query to display for each store its store ID, city, and country.
SELECT store_id, city, country
FROM store s
INNER JOIN address a
ON (s.address_id = a.address_id)
INNER JOIN city cit
ON (cit.city_id = a.city_id)
INNER JOIN country ctr
ON(cit.country_id = ctr.country_id);

#7h. List the top five genres in gross revenue in descending order. 
#(Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT SUM(amount) AS 'Total Sales', c.name AS 'Genre'
FROM payment p
INNER JOIN rental r
ON (p.rental_id = r.rental_id)
INNER JOIN inventory i
ON (r.inventory_id = i.inventory_id)
INNER JOIN film_category fc
ON (i.film_id = fc.film_id)
INNER JOIN category c
ON (fc.category_id = c.category_id)
GROUP BY c.name
ORDER BY SUM(amount) DESC;

# 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
# Use the solution from the problem above to create a view.
CREATE VIEW top_five_genres AS
SELECT SUM(amount) AS 'Total Sales', c.name AS 'Genre'
FROM payment p
INNER JOIN rental r
ON (p.rental_id = r.rental_id)
INNER JOIN inventory i
ON (r.inventory_id = i.inventory_id)
INNER JOIN film_category fc
ON (i.film_id = fc.film_id)
INNER JOIN category c
ON (fc.category_id = c.category_id)
GROUP BY c.name
ORDER BY SUM(amount) DESC
LIMIT 5;

# 8b. How would you display the view that you created in 8a?
SELECT *
FROM top_five_genres;

# 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW top_five_genres;