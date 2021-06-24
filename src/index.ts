
import yargs from "yargs";
import Container from './Composition/inversify.config'
import { IPaymentProcessor } from "./Core/Payment/Model";
import TYPES from "./Composition/Types";

// TODO: create mina currency types

const oargs = yargs.options({
  "payouthash": { type: "string", alias: ["h", "hash"] },
  "minheight": { type: "number", alias: ["m", "min"], demandOption: true },
  "maxheight": { type: "number", alias: ["x", "max"], default: Number.MAX_VALUE },
  "verbose": {type: "boolean", alias: ["v"], default: false}
}).argv;

const main = async () => {
  const payment = Container.get<IPaymentProcessor>(TYPES.IPaymentProcessor)
  payment.run(oargs)
}

main();
