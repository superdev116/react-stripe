// This example shows you how to set up React Stripe.js and use
// Embedded Checkout.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web

import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {EmbeddedCheckoutProvider, EmbeddedCheckout} from '../../src';

import '../styles/common.css';

const App = () => {
  const [pk, setPK] = React.useState(
    window.sessionStorage.getItem('react-stripe-js-pk') || ''
  );
  const [clientSecret, setClientSecret] = React.useState(
    window.sessionStorage.getItem('react-stripe-js-embedded-client-secret') ||
      ''
  );

  React.useEffect(() => {
    window.sessionStorage.setItem('react-stripe-js-pk', pk || '');
  }, [pk]);
  React.useEffect(() => {
    window.sessionStorage.setItem(
      'react-stripe-js-embedded-client-secret',
      clientSecret || ''
    );
  }, [clientSecret]);

  const [stripePromise, setStripePromise] = React.useState();

    const checkoutCallback =
      type === 'cart'
        ? (event: stripeJs.StripeCartElementPayloadEvent) => {
            setCartState(event);
            onCheckout && onCheckout(event);
          }
        : onCheckout;

    useAttachEvent(element, 'checkout', checkoutCallback);

    React.useLayoutEffect(() => {
      if (elementRef.current === null && elements && domNode.current !== null) {
        const newElement = elements.create(type as any, options);
        if (type === 'cart' && setCart) {
          // we know that elements.create return value must be of type StripeCartElement if type is 'cart',
          // we need to cast because typescript is not able to infer which overloaded method is used based off param type
          setCart((newElement as unknown) as stripeJs.StripeCartElement);
        }

        // Store element in a ref to ensure it's _immediately_ available in cleanup hooks in StrictMode
        elementRef.current = newElement;
        // Store element in state to facilitate event listener attachment
        setElement(newElement);

        newElement.mount(domNode.current);
      }
    }, [elements, options, setCart]);

    const prevOptions = usePrevious(options);
    React.useEffect(() => {
      if (!elementRef.current) {
        return;
      }

      const updates = extractAllowedOptionsUpdates(options, prevOptions, [
        'paymentRequest',
      ]);

      if (updates) {
        elementRef.current.update(updates);
      }
    }, [options, prevOptions]);

    React.useLayoutEffect(() => {
      return () => {
        if (
          elementRef.current &&
          typeof elementRef.current.destroy === 'function'
        ) {
          try {
            elementRef.current.destroy();
            elementRef.current = null;
          } catch (error) {
            // Do nothing
          }
        }
      };
    }, []);

    return <div id={id} className={className} ref={domNode} />;
  };

  // Only render the Element wrapper in a server environment.
  const ServerElement: FunctionComponent<PrivateElementProps> = (props) => {
    // Validate that we are in the right context by calling useElementsContextWithUseCase.
    useElementsContextWithUseCase(`mounts <${displayName}>`);
    useCartElementContextWithUseCase(`mounts <${displayName}>`);
    const {id, className} = props;
    return <div id={id} className={className} />;
=======
  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const handleUnload = () => {
    setStripePromise(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          CheckoutSession client_secret
          <input
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
        </label>
        <label>
          Publishable key{' '}
          <input value={pk} onChange={(e) => setPK(e.target.value)} />
        </label>
        <button style={{marginRight: 10}} type="submit">
          Load
        </button>
        <button type="button" onClick={handleUnload}>
          Unload
        </button>
      </form>
      {stripePromise && clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </>
  );
};

export default App;
