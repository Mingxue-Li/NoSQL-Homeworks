
//**********************// 
//***** Approach ******//
// ******************** //

// ************************** \\
// ******* QUESTION 1 ******* \\
// **************************** \\
// Which stages of the aggregation pipeline encompass the following: db.collection.find({field1: {$gt: 5}}, {field1:1, field2:0} )? Circle one.
// 1. ($project and $match)
// 2. $match and $group
// 3. ONLY $project
// 4. $group and $project
// 5. ONLY $match

// The answer is the 1st one


// ---------------------------------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 2 ******* \\
// **************************** \\ 
// What would the final result look like? Please select one.

//  { $month: "field_name" } converts the date into a month, ranging between 1 and 12
// match = {$match: {
//     "car_make": "tesla"
// }}
// group={$group:{
//     _id:{
//         color:"$color",
//         month:{$month: "date_sold"}
//     },
//     tr:{$sum:{$multiply:["$price", "$numSold"]}},
// }}
// sort = {"tr":-1}
// limit={$limit: 1}

// db.cars.aggregate([match, group, sort, limit])


// 1 - { _id: "color_value", _id: "month_value", tr: "some_number" }
// 2 - { _id: "color_value", _id: "month_value", tr: "some_number" }
// 3 - { _id: "color_value", "month_value", tr: "some_number" }
// 4 - { _id: {"color_value", "month_value"}, tr: "some_number" }
// (5 - { _id: {color: "color_value", month:"month_value"}, tr: "some_number" })

// The answer is the 5th one




// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------
//**********************// 
//*** Implementation ****//
// ******************** //
// General References for below:
// SQL to Aggregate Pipeline - https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/

//USE THIS MONGODB -
// mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc





// ************************** \\
// ******* QUESTION 3 ******* \\
// **************************** \\
// Group documents in the movie collection by the number of directors (key: directors array)
// for the movie and sum the number of movies in each grouping. Sort by the number of directors, 
// limit to 3 results. 
// ** NOTE ** remember to guarantee that the directors array exists

match = {$match:{
    directors:{$exists: true}
}}
addFields = {$addFields:{
    numofdirector: {$size: '$directors'}
}}
group = {$group:{
    _id:'$numofdirector', count:{$sum:1}
}}
sort = {$sort: {_id:1}}
limit = {$limit: 3}

query = db.movies.aggregate([match, addFields, group, sort, limit])


// ---------------------------------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 4 ******* \\
// **************************** \\

// Group all documents in the movie collection by their composite tomatoes score ( which is equal to tomatoes.viewer.rating multiplied 
// by tomatoes.viewer.numReviews).
// Sort by the number of documents in each grouping, limit to 3 results.
addFields = {$addFields:{
    composite: {$multiply: ['$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews']}
}}
group = {$group:{
    _id:'$composite', count:{$sum:1}
}}
sort = {$sort: {count:-1}} 
limit = {$limit:3}
query = db.movies.aggregate([addFields, group, sort, limit])



// ---------------------------------------------------------------------------------------------------------------------------------------
// ************************** \\
// ******* QUESTION 5 ******* \\
// **************************** \\ 
// Group all documents on the employee_compensation.programs.401K_contrib field in the employees collection and 
// sum the count, returning a result where the employee_compensation.programs.401K_contrib is greater than 0.1. 
// and the count of each grouping is less than 40. Make sure to sort descending by employee_compensation.programs.401K_contrib 
// and limit your return to 5 results.

// employee_compensation.programs.401K_contrib is the main key.

group = {$group: {
    _id:'$employee_compensation.programs.401K_contrib', count:{$sum:1}
}}
match = {$match:{
    '_id': {$gt:0.1}, 'count':{$lt:40}
}}
sort = {$sort:{_id:-1}}
limit = {$limit:5}
query = db.employees.aggregate([group, match, sort, limit])






try {
    while (query.hasNext()){
        printjson( query.next())
    } 
} catch(err){
    printjson(query)
}