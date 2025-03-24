allback: UnknownCallback | undefined;
    if (onReady) {
      if (type === 'expressCheckout') {
        // Passes through the event, which includes visible PM types
        readyCallback = onReady;
      } else {
        // For other Elements, pass through the Element itself.
        readyCallback = () => {
          onReady(element);
        };
      }
    }

    useAttachEvent(element, 'ready', readyCallback);

    React.useLayoutEffect(() => {
      if (
        elementRef.current === null &&
        domNode.current !== null &&
        (elements || customCheckoutSdk)
      ) {
        let newElement: stripeJs.StripeElement | null = null;
        if (customCheckoutSdk) {
          newElement = customCheckoutSdk.createElement(type as any, options);
        } else if (elements) {
          newElement = elements.create(type as any, options);
        }

        // Store element in a ref to ensure it's _immediately_ available in cleanup hooks in StrictMode
        elementRef.current = newElement;
        // Store element in state to facilitate event listener attachment
        setElement(newElement);

        if (newElement) {
          newElement.mount(domNode.current);