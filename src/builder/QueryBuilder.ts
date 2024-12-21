import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this.query.search as string;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'sortBy', 'sortOrder'];
    excludeFields.forEach((field) => delete queryObj[field]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sortOrder() {
    const sortOrder = this.query.sortOrder as string;
    if (sortOrder) {
      this.modelQuery = this.modelQuery.sort(
        sortOrder === 'desc' ? '-createdAt' : 'createdAt',
      );
    } else {
      this.modelQuery = this.modelQuery.sort('-createdAt');
    }
    return this;
  }

  sortBy() {
    const sortBy = this.query.sortBy as string;
    if (sortBy) {
      this.modelQuery = this.modelQuery.sort(`${sortBy}`);
    } else {
      this.modelQuery = this.modelQuery.sort('-createdAt');
    }
    return this;
  }
}

export default QueryBuilder;
