import { Stack } from "expo-router";

export default function SectionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,   // 👈 idhu thaan main
      }}
    />
  );
}