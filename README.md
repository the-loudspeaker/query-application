### Query Application
problem statement:
> 📌
> Create, design and implement a web-based application capable of running SQL queries and displaying the results of said query. The application must include a space which accepts SQL queries in the form of user inputs, then runs the given query, and displays the result within the application.

---
#### Solution:
[https://query-application.vercel.app/](https://query-application.vercel.app/)
#### JS frame works used:
* ReactJs
#### Libraries and packages used:
* Material-UI
* Base-UI
* material Icons
* papaparse
#### Page load times:
|First contentful paint|0.3 s|
|-|-|
|largest contentful paint|0.6 s|
|Speed index|0.5 s|
These values were measured using [Lighthouse](https://github.com/GoogleChrome/lighthouse)

#### Idea:
Basic requirements for the solution are a textbox, a submit button and a table displaying the result.
This is pretty simillar to the couchbase query workbench that I use in my day to day work.
Some nice to have improvements would be:
* Statistics of query size, time, rows, columns, etc.
* Ability to download the data in multiple formats.
* Ability to sort the table columns.
* Ability to view large chunks of data in a paginated manner.
Since the application is aimed at Data Analysts, following features would be useful for them:
* Large query space to enter multi-line queries.
* A history of recent queries.
* A list of favourite queries

#### Implementation:
Since queries and result doesn't have to be linked, I have hardcoded some results to specific key words.
Data is fetched using a GET API call and parsed using papaparse into a CSV format.
Any query with the keyword `nifty` will fetch a large amount of data which has `24k rows`.
Some queries which start with `delete`, `update`, `insert` and `drop` keywords don't actually return a response but affect rows. Application emulates this by identifying these words and not showing a table for them. But it `updates the statistics of time, size and rows`.

The application uses ReactJS framework and [Material UI components](https://mui.com/material-ui/getting-started/) of Button, Table and TextArea to build some of the functional components that are displayed. The application handles large amounts of data as shown in the video. Using `React.useState` various state variables are used and managed across the application. The application implements all of the above mentioned featuers of paginatiion, sort, recent queries, favourites, etc.
Timestamp of recent and favourite queries is also saved along with them. Clicking on them pastes the query in textbox.
Submit and favourite buttons aren't active untill the size of the query is 8 characters.

The basic wireframe of the design before starting is attached below:
### Solution design:
![](https://beta.appflowy.cloud/api/file_storage/0b1adbe0-0b00-434d-88d7-b05986c1547a/blob/820463092121150171.png)

Some improvements that can be made:
* More responsive grid layout for variable screen sizes.
* Improved theming and dark mode.
* A help button which opens a modal to give info about various parts of the application.
* Responsive max lines and word wrap in table cells.

#### Deployment
The application is deployed using [vercel](https://vercel.com/). It also has a Dockerfile and a docker-compose.yml for containerised deployment.

#### Testing:
Run the following queries in the application to test various use cases:
* `select * from development`
* `select * from products`
* `select * from nifty`
* `update * from products`
* `delete * from nifty`
Click on the favourite button to mark a query as favourite.
Click on any query in the favourites list or recent queries list to paste that query in the textbox.
