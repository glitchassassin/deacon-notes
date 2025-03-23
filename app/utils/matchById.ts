type GetKnownMatches<Matches> = Matches extends [
  infer M extends { id: unknown },
  ...infer Tail extends unknown[]
]
  ? M | GetKnownMatches<Tail>
  : never;
type GetKnownIds<Matches> = GetKnownMatches<Matches>["id"];

export function matchById<
  Matches extends ({ id: unknown } | undefined)[],
  const Id extends GetKnownIds<Matches>
>(matches: Matches, id: Id): GetKnownMatches<Matches> & { id: Id } {
  return matches?.find(
    (match) => match?.id === id
  ) as GetKnownMatches<Matches> & {
    id: Id;
  };
}
