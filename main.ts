// General subtype template.
const subtypeTemplate = () => {
  type A = {} // some specific type
  type B = A & { readonly __type: unique symbol }

  const isB = (x: A): x is B => {
    // return a boolean value
    return true
  }
  
  const x: A = {} // some value of type A
  if (isB(x)) {
    const y: B = x
    console.log('y:', y)
  }
}
// subtypeTemplate()

// This is the best basic example I have.
const positiveNumberExample = () => {
  type A = number
  type PositiveNumber = A & { readonly __type: unique symbol }

  const isPositiveNumber = (x: A): x is PositiveNumber => {
    return x >= 1
  }

  const x: A = 2
  if (isPositiveNumber(x)) {
    const y: PositiveNumber = x
    console.log('y:', y)
  }
}
// positiveNumberExample()

// Making sure the subtype can't be forcefully constructed without a predicate.
const unconstructableType = () => {
  type Animal = {
    species: 'cat' | 'dog'
  }
  
  type Pet = Animal & {
    readonly name: unique symbol
  }
  
  // Trying to construct a Pet manually should be impossible. The following lines shouldn't work.
  // const mayaName: unique symbol = Symbol()
  // const maya: Pet = {species: 'cat', name: mayaName}

  // type assertions still work, but they should never be used:
  const maya1 = <Pet>{species: 'cat'}
  const maya2 = {species: 'cat'} as Pet
  const unnamed1 = <Pet>{}
  const unnamed2 = {} as Pet
}
// unconstructableType()

const nonNegativeIntegerExample = () => {
  type NonNegativeInteger = number & { readonly __type: unique symbol }

  const isNonNegativeInteger = (x: number): x is NonNegativeInteger => {
    return !(x < 0) && Math.floor(x) === x
  }

  const betterRepeat = (s: string, n: NonNegativeInteger): string => {
    return s.repeat(n)
  }

  // success
  const ex1: number = 3
  if (isNonNegativeInteger(ex1)) {
    console.log(betterRepeat('hello', ex1))
  }

  // failure
  const ex2: number = 3.1
  if (isNonNegativeInteger(ex2)) {
    console.log(betterRepeat('hello', ex2))
  }

  // failure
  const ex3: number = -3
  if (isNonNegativeInteger(ex3)) {
    console.log(betterRepeat('hello', ex3))
  }

  // failure
  const ex4: number = -3.1
  if (isNonNegativeInteger(ex4)) {
    console.log(betterRepeat('hello', ex4))
  }
}
// nonNegativeIntegerExample()

// Making sure negation of the predicate is considered by the compiler. In fact, the compiler should essentially see which branches involving the predicate will execute.
const logicalNegationExample = () => {
  type PositiveNumber = number & { readonly __type: unique symbol }

  const isPositive = (x: number): x is PositiveNumber => {
    return x >= 1
  }
  const x: number = 2
  if (!isPositive(x)) {
    return
  }

  // This works!!
  const y: PositiveNumber = x
  console.log('y:', y)
}
// logicalNegationExample()

// Trying out validation of user input.
const validatedInputExample = () => {
  type FormInput = {
    name: string
    birthYear: string
  }

  type ValidName = string & { readonly __type: unique symbol }
  const isValidName = (name: string): name is ValidName => name.trim().length > 0

  type ValidBirthYear = number & { readonly __type: unique symbol }
  const isValidBirthYear = (year: number): year is ValidBirthYear => {
    const thisYear: number = new Date().getFullYear()
    return year >= 1900 && year <= thisYear
  }

  const register = (name: ValidName, birthYear: ValidBirthYear): void => {
    console.log(`Registering user with name "${name}" born in ${birthYear}`)
  }

  // Simulate user input
  const promptName = (): string => 'test'
  // Simulate user input
  const promptBirthYear = (): string => '1800'
  
  const nameInput: string = promptName()
  const birthYearInput: number = Number(promptBirthYear())

  if (!isValidName(nameInput)) {
    console.log('Name cannot be empty')
  } else if (!isValidBirthYear(birthYearInput)) {
    console.log('Invalid birth year')
  } else {
    register(nameInput, birthYearInput)
  }

  // We can also validate the input as a whole if we don't care about keeping track of the specific failure(s).
  type ValidInput = FormInput & { readonly __type: unique symbol }
  const isValidInput = (input: FormInput): input is ValidInput => {
    return isValidName(input.name) && isValidBirthYear(Number(input.birthYear))
  }

}
// validatedInputExample()

// Making a type for non-empty arrays.
// Very useful in functional programming!
const nonEmptyArrayExample = () => {

  type NonEmptyArray<T> = Array<T> & { readonly __type: unique symbol }

  // Used for proving an array is non-empty.
  const isNonEmptyArray = <T>(xs: Array<T>): xs is NonEmptyArray<T> => xs.length >= 1

  // Think of
  //   xs is NonEmptyArray<T>
  // as a special boolean.

  const head = <T>(xs: NonEmptyArray<T>): T => xs[0]

  const arr1: Array<number> = [1, 2, 3]
  const arr2: Array<number> = []

  // We can only call head on a NonEmptyArray, with a proof.
  if (isNonEmptyArray(arr1)) { // Proof that xs is a non-empty array
    const nea: NonEmptyArray<number> = arr1
    console.log('head(nea):', head(nea))

    // But we can also use arr1 directly!
    console.log('head(arr1):', head(arr1))
  }

  // This produces a type error.
  // console.log(head(arr2))

}
// nonEmptyArrayExample()

// Making a subtype for whole numbers.
const wholeNumberExample = () => {

  // Type formation
  type WholeNumber = number & { readonly __type: unique symbol }

  // Used for proving a number is whole.
  const isWholeNumber = (n: number): n is WholeNumber => n === Math.floor(n)

  const someNumber: number = 3
  const anotherNumber: number = 3.5

  // We can only make a WholeNumber value if we have a proof that it is whole.
  if (isWholeNumber(someNumber)) { // Proof that someNumber is whole.
    const wn: WholeNumber = someNumber
    console.log('wn:', wn)
  }
  
}
// wholeNumberExample()

// Making a subtype for high numbers.
const highNumberExample = () => {

  type HighNumber = number & { readonly __type: unique symbol }

  // Used for proving a number is high.
  const isHighNumber = (n: number): n is HighNumber => n >= 100

  const x: number = 105
  const y: number = 5

  // We can only make a HighNumber value if we have a proof that it is high.
  if (isHighNumber(x)) { // Proof that x is high
    const hn: HighNumber = x
    console.log('hn:', hn)
  }

}
// highNumberExample()

// Making a subtype for prime numbers to show that the predicate can be as complex as we want.
const primeNumberExample = () => {
  type Prime = number & { readonly __type: unique symbol }

  const isPrime = (n: number): n is Prime => {
    if (n < 2) return false

    const sieve = (x: number, limit: number): boolean => {
      if (x > limit) {
        return x > 1
      } else if (n % x === 0) {
        return false
      } else {
        return sieve(x + 1, limit)
      }
    }
    
    return sieve(2, Math.sqrt(n))
  }

  const ex1: number = 2
  if (isPrime(ex1)) {
    console.log(`${ex1} is prime`)
  }

  const ex2: number = 13
  if (isPrime(ex2)) {
    console.log(`${ex2} is prime`)
  }
  
  const ex3: number = 14
  if (isPrime(ex3)) {
    console.log(`${ex3} is prime`)
  }
}
// primeNumberExample()

// A bigger, more real-world example.
const wardrobeExample = () => {
  type Colour = 'white' | 'cream' | 'blue' | 'navy' // ...

  type Wardrobe = {
    owner: {
      name: string
      age: number
    }
    tops: Colour[]
    pants: Colour[]
    shorts: Colour[]
    skirts: Colour[]
    desiredNumberOfOutfits: number
  }

  type ValidWardrobe = Wardrobe & { readonly __type: unique symbol }

  const isValidWardrobe = (wardrobe: Wardrobe): wardrobe is ValidWardrobe => {
    const numOutfits: number =
      wardrobe.tops.length * wardrobe.pants.length
      + wardrobe.tops.length * wardrobe.shorts.length
      + wardrobe.tops.length * wardrobe.skirts.length

    return numOutfits >= wardrobe.desiredNumberOfOutfits
  }

  const suggestOutfits = (wardrobe: ValidWardrobe): void => {
    console.log(`Printing suggested outfits for ${wardrobe.owner.name}...`)
    // Do stuff here, knowing that wardrobe has already been validated.
  }

  const ex1: Wardrobe = {
    owner: {
      name: 'Alice',
      age: 22
    },
    tops: ['blue', 'white', 'cream'],
    pants: ['navy', 'blue'],
    shorts: ['navy'],
    skirts: ['navy', 'blue'],
    desiredNumberOfOutfits: 15
  }
  if (isValidWardrobe(ex1)) {
    suggestOutfits(ex1)
  }
}
// wardrobeExample()

// A subtype for pairs where the first number is divisible by the second number.
// This is closer to dependent pairs.
const divisibleExample = () => {
  type Divisible = [number, number] & { readonly __type: unique symbol }

  const isDivisible = (xy: [number, number]): xy is Divisible => {
    const [x, y] = xy
    return (x / y) === Math.floor(x / y)
  }

  const ex1: [number, number] = [6, 2]
  if (isDivisible(ex1)) {
    console.log(`${ex1} is divisible`)
  }
}
// divisibleExample()

// A more complicated example, closer to dependent pairs. But this can still be considered a subtype; it is the type of valid month-day tuples. They could even be enumerated.
const monthAndDayExample = () => {

  // If B is constant, then the dependent pair type is the product type: A x B .
  // In TypeScript, this is a tuple: [A, B] .

  type Month = 'January' |
    'February' |
    'March' |
    'April' |
    'May' |
    'June' |
    'July' |
    'August' |
    'September' |
    'October' |
    'November' |
    'December'
  type Year = number
  type MonthAndYear = [Month, Year]

  const ex1: MonthAndYear = ['September', 2023]

  // If we want days, the day range depends on the value the month. This is a dependent pair, because the second part depends on the value of the first part.

  // First, we make a special pair type (tuple) with an extra piece of information.
  // Think of the extra piece of information as a proof.
  type MonthAndDay = [Month, number] & { readonly __type: unique symbol }

  // This is used to prove that a [Month, number] pair is valid as a MonthAndDay. It's the only way to obtain a value of type MonthAndDay.
  const isMonthAndDay = (pair: [Month, number]): pair is MonthAndDay => {
    const [month, day]: [Month, number] = pair
    if (month === 'February') {
      return day >= 1 && day <= 28
    } else if (['January', 'March', 'May', 'July', 'August', 'October', 'December'].includes(month)) {
      return day >= 1 && day <= 31
    } else {
      return day >= 1 && day <= 30
    }
  }

  // The following line produces a type error because we didn't provide the extra piece to make this type directly.
  // const jan1: MonthAndDay = ['January', 1]

  // We can make a regular pair, but we need to use it along with a isMonthAndDay proof to make a value of type MonthAndDay.
  const ex2: [Month, number] = ['April', 31]

  // This check shouldn't pass, which means we never get to have the apr31 MonthAndDay value.
  if (isMonthAndDay(ex2)) {
    const apr31: MonthAndDay = ex2
    console.log('apr31:', apr31)
  }

  const ex3: [Month, number] = ['April', 30]

  // This check passes at runtime, so we have a valid value of type MonthAndDay inside.
  if (isMonthAndDay(ex3)) {
    const apr30: MonthAndDay = ex3
    console.log('apr30:', apr30)

    // Or, as a shortcut we can just use the previous value directly. With the proof given, TypeScript can now accept this value's type as [Month, number] or MonthAndDay.
    console.log('ex3:', ex3)
  }

}
// monthAndDayExample()

// Getting closer to real dependent pairs.
const dependentPairExample = () => {
  type SomeType<A> = A & { readonly __type: unique symbol }
  const B = <A>(x: A): x is SomeType<A> => {
    return true
  }
  
  // type Pair<A> = SomeType<A> & { readonly __type: unique symbol }

  // const isPair = <A>(x: A): x is Pair<A> => {
  //   return true
  // }

  // Empty type
  type Empty = any & { readonly __type: unique symbol }
  const isEmpty = (x: any): x is Empty => false

  // Type family
  type D = [boolean, any] & { readonly __type: unique symbol }
  const isD = (xy: [boolean, any]): xy is D => {
    const [x, y] = xy
    return x === true ? typeof y === 'number'
      : typeof y === 'boolean'
  }

  const ex1: [boolean, any] = [true, 17]
  if (isD(ex1)) {
    console.log('ex1 passes')
  }

  const ex2: [boolean, any] = [false, true]
  if (isD(ex2)) {
    console.log('ex2 passes')
  }

  const ex3: [boolean, any] = [true, false]
  if (isD(ex3)) {
    console.log('ex3 passes')
  }

}
// dependentPairExample()
