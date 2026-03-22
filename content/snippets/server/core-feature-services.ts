class DemoMessageBoardService {
  private selectedText = eventPresets[0]?.text ?? "";

  applyEvent(payload: DemoEventPayload): void {
    this.selectedText = payload.text;
  }

  getSelectedText(): string {
    return this.selectedText;
  }
}

context.services.set("featureCatalog", featureCatalogService);
context.services.set("demoMessageBoard", messageBoardService);
