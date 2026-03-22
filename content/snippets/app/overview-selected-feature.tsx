const selectedFeature =
  session?.features.find(feature => feature.id === selectedFeatureId) ??
  session?.features[0] ??
  null;

if (authState === "authenticated" && session) {
  return (
    <ProtectedShell
      modeLabel={modeLabel}
      onLogout={handleLogout}
      onSelectFeature={handleSelectFeature}
      runtimeSnapshot={runtimeSnapshot}
      selectedFeature={selectedFeature}
      session={session}
    />
  );
}
