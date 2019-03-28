//****************************// 
//******** Approach *********//
// ************************ //
// 1. Write the analogous components in SQL/relational. Fill in all to receive full credit.
// Node = Row
// Label = Table
// Properties = Column





// 2 - Please re-write the following Neo4j query as a MongoDB query. Pick one.
// Neo4j Query
// match (a:Person {name: "Hemingway"})
// return a.age, a.name as authorName

// a. db.find({name: "Hemingway"}, {_id:0, name:1, age:1})
// b. db.person.find({name: "Hemingway"}, {_id:0, name:1, age:1})
// c. db.person.find({name: "Hemingway"}, {_id:0, authorName:1, age:1})
// d. db.person.find({name: "Hemingway"}, {_id:0, authorName:"$name", age:1})
// e. db.aggregate([ {$match: { name:"Hemingway" }}, {$project: { age:1, _id:0, authorName:"$name" }} ])
// f. db.person.aggregate([ {$match: { name:"Hemingway" }}, {$project: { age:1, _id:0, authorName:"name" }} ])
// g. db.person.aggregate([ {$match: { name:"Hemingway" }}, {$project: { age:1, _id:0, authorName:"$name" }} ])

// The answer should be g.


//****************************// 
//***** Implementaiton ******//
// ************************ //
// -----------------------------------------------------------------------------------
// MongoDB Questions - use mongo ds145962-a1.mlab.com:45962/joinin -u dso -p uscdso42
// -----------------------------------------------------------------------------------

// ************************** \\
// ******* QUESTION 1 ******** \\
// **************************** \\
//  What is the unrealized revenue from attendees who got in for free (key=discountUsers, type: array) (collection = listings)?
//  And how many attendees in total got in for free?

match = {$match:{
    'discountUsers': {$ne: []}
}}
addFields1 = {$addFields:{
    num: {$size: '$discountUsers'}
}}
addFields2 = {$addFields:{
    mul: {$multiply: ['$num', '$price']}
}}
group = {$group:{
    _id:null,
    revenue:{$sum:'$mul'}
}}
project = {$project: {
    _id:0, revenue:1
}}

query = db.listings.aggregate([match, addFields1, addFields2, group, project])

// OUTPUT: { "revenue" : 4174 }


// SAMPLE OUTPUT:
// { revenue: someNumber }




// ************************** \\
// ******* QUESTION 2 ******** \\
// **************************** \\
// Return the top 2 counts of messages (chats) by user and chat group size (group size = key:userData, type: array) ?
// Sort by count descending. Dont include documents where there are no messages.
// Collection = inboxes
// messages are in a field  = "messages" is an array of embedded documents, each message having a key=user_id and a "body" i.e. message

// Remember: 
// to $group on 2 fields at the same time, include it as part of the matching criteria as so:
// _id: {field1: "$field", field2: "$field2"}

match={$match:{
    messages:{$ne:[]}
}}
addFields={$addFields:{
    groupSize:{$size:'$userData'}
}}
unwind={$unwind:'$messages'}
group={$group:{
    _id:{user:'$messages.user_id', groupSize:'$groupSize'},
    count:{$sum:1}
}}
project={$project:{
    count:1, _id:0, user:'$_id.user', groupSize:'$_id.groupSize'
}}
sort={$sort:{count:-1}}
limit={$limit:2}
query=db.inboxes.aggregate([match,addFields,unwind,group,project,sort,limit])


//OUTPUT:
// { "count" : 320, "user" : "58928d4d2cff88000325d767", "groupSize" : 2 }
// { "count" : 173, "user" : "581e6696c8c4e7030062160f", "groupSize" : 3 }



// SAMPLE OUTPUT:
// { "count" : 5, "user" : "some user key", "groupSize" : 20 }
// { "count" : 4, "user" : "some user key", "groupSize" : 13 }





// ************************** \\
// ******* QUESTION 3 ******** \\
// **************************** \\
// Find the top 2 most common pins attached to Posts that are not Private (key:isPrivate not true).
// Rename the matching criteria as "pinReference", include the count, and exclude _id.
// Collection = posts
// Pins "attached" are inside an array called pin_array

match = {$match:{
    'isPrivate':{$ne: true}
}}
unwind = {$unwind:'$pin_array'}
group = {$group:{
    _id:'$pin_array',
    count:{$sum:1}
}}
project = {$project:{
    _id:0, pinReference: '$_id', count:1
}}
sort = {$sort: {'count':-1}}  
limit = {$limit:2}


query = db.posts.aggregate([match, unwind, group, project, sort, limit])

//OUTPUT
// { "count" : 3, "pinReference" : "57fc4a48a67c110300a8e842" }
// { "count" : 3, "pinReference" : "5819cfc2b8b6ec0300bb6c69" }


// SAMPLE OUTPUT
// { "count" : 92, "pinReference" : "some pin id" }
// { "count" : 48, "pinReference" : "some pin id" }







// -----------------------------------------------------------------------------------
// Neo4j Question - use Movie database we used in class
// -----------------------------------------------------------------------------------

// ************************** \\
// ******* QUESTION 4 ******** \\
// **************************** \\
// Return the score (relationship=REVIEWED, key: rating ) and name of the person (relationship=Person, key:name) who reviewed 
// (relationship=REVIEWED)the movie "Cloud Atlas" (relationship=Movie, key: title)

match (p:Person)-[r:REVIEWED]->(m:Movie{title:'Cloud Atlas'})
return p.name as name, r.rating as rating

// OUTPUT:
// "Jessica Thompson", 95


// SAMPLE OUTPUT:
// "Tony Stark", 10



// ************************** \\
// ******* QUESTION 5 ******** \\
// **************************** \\
// Find people who either directed or acted in (relationship = DIRECTED, ACTCED_IN)
// a movie that person definitely produced (relationship=PRODUCED) that movie.
// Return the name (key:name of Person node), title and type of relationship for whether it is DIRECTED or ACTED_IN.

match (p:Person)-[r1:ACTED_IN|DIRECTED]-> (m:Movie) <- [r2:PRODUCED]-(p:Person)
return p.name as name, m.title as title, type(r1)

// OUTPUT:
// "Cameron Crowe",	    "Jerry Maguire",	        "DIRECTED"
// "Rob Reiner",	    "When Harry Met Sally",	    "DIRECTED"
// "Nancy Meyers",	    "Something's Gotta Give",	"DIRECTED"



// SAMPLE OUTPUT:
// "Tom Hanks",	         "The Matrix",	 "ACTED_IN"
// "Charlize Theron", 	 "Top Gun",	     "DIRECTED"
// "Renee Zellweger", 	 "Stand By Me",	 "DIRECTED"



try {
    while (query.hasNext()){
        printjson( query.next())
    } 
} catch(err){
    printjson(query)
}


