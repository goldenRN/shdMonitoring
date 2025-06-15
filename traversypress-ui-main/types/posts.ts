export interface Post {
  id: string;
  order: string;
  title: string;
  body: string;
  source:string;
  executor:string;
  budget: BigInteger;
  contractValue: BigInteger;
  engineer:string;
  khoroo: string;
  startDate: Date;
  endDate: Date;
  orderNum: String;
  stage:string;
  precent:BigInteger;
}

export interface KhorooLst {
  id: string;
  name: string;
  district: string;
}
