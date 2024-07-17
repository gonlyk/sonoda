export enum DatabaseType {
  VARCHAR = 1,
  INTEGER,
  JSONB,
  JSON,
  BOOL,
}

export abstract class BaseType {
  abstract type: DatabaseType
  abstract toString(): string
  abstract valueOf(): any
}

export class Varchar extends BaseType {
  type = DatabaseType.VARCHAR
  size: number
  constructor(size: number) {
    super()
    this.size = Math.min(255, parseInt(size.toFixed()))
  }
  toString() { return `VARCHAR(${parseInt(this.size.toFixed())})` }
  valueOf() { return [this.type, this.size] }
}

export class Integer extends BaseType {
  type = DatabaseType.INTEGER
  toString() { return `INTEGER` }
  valueOf() { return [this.type] }
}

export class Jsonb extends BaseType {
  type = DatabaseType.JSONB
  toString() { return `JSONB` }
  valueOf() { return [this.type] }
}

export class Json extends BaseType {
  type = DatabaseType.JSON
  toString() { return `JSONB` }
  valueOf() { return [this.type] }
}

export class Bool extends BaseType {
  type = DatabaseType.BOOL
  toString() { return `BOOLEAN` }
  valueOf() { return [this.type] }
}
