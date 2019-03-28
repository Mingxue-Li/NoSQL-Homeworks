//**********************// 
//***** Approach ******//
// ******************** //

// Section 1 - Approach
// 1. What are the fundamental characteristics of MongoDB (document database)? Please circle all that apply.
// -Schemaless
// -Flexible
// -Consistent
// -Highly Available

// The answer is Schemaless, Flexible


// 2. In MongoDB, how do you query for a value inside an embedded document? Circle one. Assume `field` refers to the field identifying the embedded document.
// -field[“value”]
// -field.”value”
// -field.value
// -”field.value”

// The answer is field.value



// 3. Assuming the same collection and database, will these two statements necessarily always return the same result → age: {$not: {$lt: 20}} vs age: {$gte:20} ? Circle all that may apply.
// -Yes, they mean the same thing
// -No, $gte is not the same as not less than something
// -No, comparison operators (e.g. $lt) check against a value, logical operators (e.g. $not) operates on other operators
// -No, comparison operators (e.g. $lt) operators on other operators, logical operators (e.g. $not) check against a value

// The answer is 'No, comparison operators (e.g. $lt) check against a value, logical operators (e.g. $not) operates on other operators's
// The first query will select age gte 20 and NAs.




// 4. In what order do the chaining functions of sort(), skip(), and limit() get executed? Circle one.
// -sort() → skip() → limit()
// -skip() → sort() → limit()
// -limit() → sort() → skip()
// -limit() → skip() → skip()

// The answer is sort() → skip() → limit()





//**********************// 
//*********************// 
//** IMPLEMENTATION **//
//** ****************//
//******************//

// Connect to the following MongoDB (we used during class)
// mongo ds139705.mlab.com:39705/usc_nosql -u usc -p usc553




//*********************************// 
//****** Athlete Collection ******//
//*******************************//
// **use athlete collection

// ---------------------------------------------------------------------------------------------------------------------------------------
// 1. What’s the total number of people who are either from Italy (key=NOC, value="ITA") and won the Gold or
// from Jamaica (key=NOC, value="JAM") and did not win a Gold ? Please include the code and the final result.
let q1 = {$and:[{NOC:'ITA'}, {Medal:'Gold'}]}
let q2 = {$and:[{NOC:'JAM'}, {Medal:{$ne: 'Gold'}}]}
db.athlete.find({$or: [q1,q2]}).count()
// The answer is 1385

// ---------------------------------------------------------------------------------------------------------------------------------------
// 2. Write the below SQL as a MongoDB query. Please include the answer and the code.
`
SELECT COUNT(*)
FROM athlete
WHERE Age BETWEEN 29 AND 31 AND Sex = "F" AND Medal = "Gold" AND Year > 2012
`
// All the keys and values you need are listed as columns and values in the query above.
let q100 = {$and:[{Age:{$lte:31}}, {Age:{$gte:29}}, {Sex:'F'}, {Medal:'Gold'}, {Year:{$gt:2012}}]}
db.athlete.find(q100).count()
// The answer is 65


//*********************************// 
//******* Nobel Collection *******//
// ***************************** //
// **use nobel collection



// -------------------------------------------------------------------------------
// 3. How many nobel laureates won prizes in the category (key: prizes - category) of 
// chemistry or physics (value: chemistry, value:physics) and won prizes with affiliations country 
// (key: prizes - affiliations - country) as the Netherlands or United Kingdom (value: the Netherlands, value: United Kingdom)?
// Please include the code and the final result.
let q12 = {$or: [{'prizes.category':'chemistry'}, {'prizes.category':'physics'}]}
let q13 = {$or: [{'prizes.affiliations.country':'the Netherlands'}, {'prizes.affiliations.country':'United Kingdom'}]}
db.nobel.find({$and: [q12,q13]}).count()
// The answer is 61





// --------------------------------------------------------------------------------------
// 4. Return the count of all the documents in the nobel collection where no value in the
// new score array (key: new_score_array) is greater than 85 and the new array (key:new_array)
// has the the following elements: pink, green (value: "pink", value:"green"). Please include the code and the final result.
let q123 = {$nor: [{new_score_array: {$gt: 85}}]}
let q45 = {new_array: {$in: ['pink', 'green']}}
db.nobel.find({$and: [q123,q45]}).count()
// The answer is 8


// -------------------------------------------------------------------------------
// 5. Write the following SQL query in MongoDB. Please include the code and the final result.
// Must use the $nin operator here. It is exactly the same as the $in operator in syntax.

`SELECT firstname 
FROM nobel 
WHERE new_array IN ("ruby","green") AND new_score_array NOT IN (51,77) AND gender="male" 
ORDER BY firstname desc
LIMIT 1`

// All the keys and values you need are listed as columns and values in the query above.
let q8 = {$and: [{new_array: {$in: ['ruby', 'green']}}, {new_score_array:{$nin: [51,77]}}, {gender:'male'}]}
db.nobel.find(q8, {firstname:1, _id:0}).sort({firstname:-1}).limit(1)
// The answer is { "firstname" : "Sir Frank Macfarlane" }



//**********************************// 
//***** Restaurant Collection *****//
// ****************************** //
// **use restaurant collection


// -------------------------------------------------------------------------------------------------------------------------
// 6. What’s the name of the restaurant whose grade (key: grades -- grade) is not “Not Yet Graded” (value: "Not Yet Graded")
// sorted by grades date (key:grades -date) descending ? Please include the code and the final result.
db.restaurant.find({'grades.grade': {$ne: 'Not Yet Graded'}}, {name:1, _id:0}).sort({'grades.date':-1})
// The answers are: 
// The first one is { "name" : "Cafe Un Deux Trois" }, and the total number of names is 3771


