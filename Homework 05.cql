//**********************// 
//***** Approach ******//
// ******************** //


// ************************** \\
// ******* QUESTION 1 ******* \\
// **************************** \\
// How would you write this in Cypher: 
// A teacher who teaches students that live in Los Angeles and attends USC. Return the student
// names.

a)  match (teacher)-[:TEACHES]-(s)-[:LIVE_IN]->(:Location{name:"Los Angeles"}),
 (s)-[:ATTENDS]->(u:SCHOOL{name:"USC"})

b) match (teacher)-[:TEACHES]->(s)-[:LIVE_IN]->(:Location{name:"Los Angeles"}),
 (s)-[:ATTENDS]->(u:SCHOOL{name:"USC"})

c) match (teacher)-[:TEACHES]->(s)-[:LIVE_IN]->(:Location{name:"Los Angeles"}),
    (s)-[:ATTENDS]->(u:SCHOOL{name:"USC"})
return s.name

d) match (teacher)-[:TEACHES]-(s)-[:LIVE_IN]->(:Location{name:"Los Angeles"}),
    (s)-[:ATTENDS]->(u:SCHOOL{name:"USC"})
return s.name
// The answer is c.


// ************************** \\
// ******* QUESTION 2 ******* \\
// **************************** \\
// Place the building blocks of Neo4j in the context of MongoDB. See below:
// Nodes = Documents
// Labels = Collections
// Relationships = Key:value pairs
// Properties = Key:value pairs











//***********************// 
//*** Implementation ***//
// ******************* //



// ************************** \\
// ******* QUESTION 3 ******* \\
// **************************** \\
// Find all the movies that were released between 2000 and 2010 (not inclusive) where the rating
// (:REVIEWED, key:rating) for those movies are either greater than 90 or less than 70. Return the
// movie title (:Movie, key:title), rating, and movie released year (:Movie, key:year). Order by
// rating descending and limit to 3 results.

// For cypher, remember to keep the boolean operators separate (and vs or).
// For example:
// where n.born > 1980 and (OR condition)
match (p:Person)-[r:REVIEWED]->(m:Movie)
where 2000 < m.released < 2010 and (r.rating > 90 or r.rating < 70)
return m.title, r.rating, m.released
order by r.rating desc
limit 3

// OUTPUTS
// "The Da Vinci Code"	68	2006
// "The Da Vinci Code"	65	2006


// How would you write this in MongoDB without using Aggregation Pipeline, assuming the following:
// Movie Collection
// rating: Number,
// released: Date,
// title
db.Movie.find({$and:[{'m.released':{$gt:2000}},{'m.released':{$lt:2010}},{$or:[{'r.rating':{$gt:90}},{'r.rating':{$lt:70}}]}]},{_id:0,'m.title':1,'r.rating':1,'m.released':1}).sort({'r.rating':-1}).limit(3)



// SAMPLE OUTPUT (Neo4j) - *only structural, not the answer:
// "The Birdcage", 45,	1996
// "Unforgiven", 85,	1992





// ---------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 4 ******* \\
// **************************** \\
// Return distinct actors (DISTINCT operator in return clause) of movies that have
// two different reviewers (relationship :REVIEWED). Sort by descending actor
// name (:Person, key:name). Limit to 3 results.
match (p1:Person)-[:REVIEWED]->(m:Movie)<-[:REVIEWED]-(p2:Person), (p3:Person)-[:ACTED_IN]->(m)
return distinct p3.name
order by p3.name desc
limit 3

// OUTPUTS
// "Tom Hanks"
// "Paul Bettany"
// "Orlando Jones"



// SAMPLE OUTPUT - *only structural, not the answer:
// "Emil Eifrem"
// "Charlize Theron"
// "Al Pacino"




// ---------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 5 ******* \\
// **************************** \\
// List 5 friends (via the :HAS_CONTACT relationship) of friends of Tom Hanks who
// he doesn't know immediately (i.e. 2 HAS_CONTACT traversals)  and is born between 1950 and 1960. 
// Return their names and born year (:Person, key:name, key:born) and order by names descending. Limit to 3 results.
// ** NOTE ** Make sure tom is not one of the results. 
match (p:Person{name:'Tom Hanks'})-[:HAS_CONTACT]->(p1:Person)-[:HAS_CONTACT]->(p2:Person)
where not (p)-[:HAS_CONTACT]-(p2) and p2.born>=1950 and p2.born<=1960 and not 'Tom Hanks' in p2.name
return p2.name, p2.born
order by p2.name desc
limit 3


// OUTPUTS
// "Zach Grenier"	1954
// "Vincent Ward"	1956
// "Val Kilmer"	1959



// SAMPLE OUTPUT - *only structural, not the answer:
// "Keanu Reeves"	1964
// "Carrie-Anne Moss"	1967
// "Laurence Fishburne"	1961




// ---------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 6 ******* \\
// **************************** \\
// List the second-degree actors in Tom’s network with whom he has not acted with but could. In other words,
// we are looking for Tom's co-actors' co-actors (call them coCoActors) where Tom and these coCoActors
// have not acted in any movie together and that none of these coCoActors are Tom. Limit results to 3.

// **** NOTE ****
// To check for this, you can either remove the limit to see if Tom Hanks appears, or
// set the coCoActor name to Tom Hanks and see if any node is returned.

match (p1:Person)-[:ACTED_IN]->(m1:Movie)<-[:ACTED_IN]-(p:Person{name:'Tom Hanks'})
match (coCoActors:Person)-[:ACTED_IN]->(m2:Movie)<-[:ACTED_IN]-(p1)
where not (coCoActors)-[:ACTED_IN]->()<-[:ACTED_IN]-(p) and not 'Tom Hanks' in coCoActors.name
return distinct coCoActors.name
limit 3

// OUTPUTS
// "Zach Grenier"
// "Billy Crystal"
// "Carrie Fisher"


// SAMPLE OUTPUT - *only structural, not the answer:
// "Tom Hanks"
// "Tom Cruise"
// "Christian Bale"






// ---------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 7 ******* \\
// **************************** \\
// Similar to the last problem, but only show the people that Tom Hanks already knows (:HAS_CONTACT) with because
// then he could easily get a hold of them for his next movie! Limit to 3 results.

match (p1:Person)-[:ACTED_IN]->(m1:Movie)<-[:ACTED_IN]-(p:Person{name:'Tom Hanks'})
match (coCoActors:Person)-[:ACTED_IN]->(m2:Movie)<-[:ACTED_IN]-(p1), (coCoActors)-[:HAS_CONTACT]-(p)
where not (p)-[:ACTED_IN]->(m2) and not (coCoActors)-[:ACTED_IN]->(m1)
return distinct coCoActors.name
limit 3

// OUTPUTS
// "Carrie Fisher"
// "Bruno Kirby"
// "Gene Hackman"






// SAMPLE OUTPUT - *only structural, not the answer:
// "Tom Hanks"
// "Tom Cruise"
// "Christian Bale"



