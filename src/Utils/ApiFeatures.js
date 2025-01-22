export class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  pagination() {
    const page = this.queryStr.page || 1;
    const limit = 2;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    return this;
  }
  filter() {
    const exclude = ["page", "limit", "sort", "search", "select"];
    const filter = { ...this.queryStr };
    exclude.forEach((key) => {
      if (this.queryStr[key]) {
        delete filter[key];
      }
    });
    const filterQuery = JSON.parse(
      JSON.stringify(filter).replace(
        /(gt|gte|lt|lte|eq)/,
        (match) => `$${match}`
      )
    );
    this.query = this.query.find(filterQuery);
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  search() {
    if (this.queryStr.search) {
      const search = this.queryStr.search;
      this.query = this.query.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }
    return this;
  }
  select() {
    if (this.queryStr.select) {
      console.log(this.queryStr.select);
      this.query = this.query.select(this.queryStr.select.split(",").join(" "));
      console.log(this.query);
    }
    return this;
  }
}
