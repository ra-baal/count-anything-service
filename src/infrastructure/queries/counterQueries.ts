import { Counter } from "../../common/counter.js";
import { sql } from "../database.js";

type CounterId = { id: string };

async function createCounter(name: string, userId: string): Promise<Counter> {
  const [counter] = (await sql`
    INSERT INTO counters (name, value, accountid)
    VALUES (${name}, 0. ${userId})
    RETURNING id, name, value, accountid
  `) as Counter[];
  return counter;
}

async function decrementCounter(id: string, userId: string): Promise<Counter> {
  const [updatedCounter] = (await sql`
    UPDATE counters
    SET value = GREATEST(value - 1, 0)
    WHERE id = ${id} AND accountid = ${userId}
    RETURNING *
  `) as Counter[];
  return updatedCounter;
}

async function deleteCounter(id: string, userId: string): Promise<CounterId> {
  const [deleted] = (await sql`
    DELETE FROM counters
    WHERE id = ${id} AND accountid = ${userId}
    RETURNING id
  `) as CounterId[];
  return deleted;
}

async function getCounters(userId: string): Promise<Counter[]> {
  return (await sql`
    SELECT * FROM counters
    WHERE accountid = ${userId}
    ORDER BY id ASC
  `) as Counter[];
}

async function incrementCounter(id: string, userId: string): Promise<Counter> {
  const [updatedCounter] = (await sql`
    UPDATE counters
    SET value = value + 1
    WHERE id = ${id} AND accountid = ${userId}
    RETURNING *
  `) as Counter[];
  return updatedCounter;
}

async function resetCounter(id: string, userId: string): Promise<Counter> {
  const [resetedCounter] = (await sql`
    UPDATE counters
    SET value = 0
    WHERE id = ${id} AND accountid = ${userId}
    RETURNING *
  `) as Counter[];
  return resetedCounter;
}

export const counterQueries = {
  create: createCounter,
  decrement: decrementCounter,
  delete: deleteCounter,
  getAll: getCounters,
  increment: incrementCounter,
  reset: resetCounter,
};
