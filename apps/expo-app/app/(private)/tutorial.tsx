import { ScrollView, Text, View } from 'react-native';

export default function Tutorial () {
  return (
    <ScrollView>
      <View className="mb-10 p-4">
        <Text className="mb-2 mt-4 text-xl">
          <Text className="font-bold">1. Wallets</Text>
        </Text>
        <Text className="mb-2">
          Wallets represent the actual places where your money lives.
          Think of them as containers for your funds.
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Examples</Text>: your physical
          wallet (cash), a savings account, checking account, mobile
          wallet, or even a credit card.
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Why this matters</Text>: By
          separating your money into wallets, you can track balances
          accurately. For instance, you'll always know how much cash
          you have on hand versus how much is in the bank.
        </Text>
        <Text className="mb-2 mt-4 text-xl">
          <Text className="font-bold">2. Categories</Text>
        </Text>
        <Text className="mb-2">
          Categories let you organize your spending and income into
          meaningful groups.
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Examples</Text>: Food,
          Transportation, Rent, Utilities, Entertainment, or Salary.
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Why this matters</Text>: When
          your transactions are categorized, you can quickly see
          where your money is going (or coming from). It makes it
          easier to spot spending habits, cut down on unnecessary
          expenses, and plan budgets.
        </Text>
        <Text className="mb-2 mt-4 text-xl">
          <Text className="font-bold">3. Tags</Text>
        </Text>
        <Text className="mb-2">
          Tags give you an extra layer of detail and flexibility.
          While categories answer{' '}
          <Text className="italic">
            “what type of expense/income is this?”
          </Text>
          , tags answer{' '}
          <Text className="italic">“what was this for?”</Text>
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Examples</Text>: A “Food”
          category transaction could have tags like work lunch, date
          night, or grocery run.
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Why this matters</Text>: Tags
          allow you to filter and analyze your transactions across
          categories. For example, you might want to know how much
          you spent on “vacation” in total, even though it includes
          food, transportation, and hotel expenses.
        </Text>
        <Text className="mb-2 text-xl">
          <Text className="font-bold">4. Transactions</Text>
        </Text>
        <Text className="mb-2">
          <Text className="font-bold">Important</Text>: You will need
          to create at least one wallet and category before you can
          start recording transactions.
        </Text>
        <Text className="mb-2">
          Transactions record every time money moves in or out of
          your wallets. They can be{' '}
          <Text className="italic">expenses</Text> (money out),{' '}
          <Text className="italic">income</Text> (money in), or{' '}
          <Text className="italic">transfers</Text> between your own
          wallets.
        </Text>
        <Text className="mb-2">
          Each transaction has details like the amount, date, wallet,
          category, and optional tags or notes. Recording them
          regularly gives you a clear picture of your spending and
          income.
        </Text>
      </View>
    </ScrollView>
  );
}
