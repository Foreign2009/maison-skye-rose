"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type FeedbackItem = {
  title: string;

  image: string;

  size: string;
};

type CartFeedbackContextType = {
  feedback: FeedbackItem | null;

  showFeedback: (
    item: FeedbackItem
  ) => void;
};

const CartFeedbackContext =
  createContext<CartFeedbackContextType>({
    feedback: null,

    showFeedback: () => {},
  });

export function CartFeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [feedback, setFeedback] =
    useState<FeedbackItem | null>(
      null
    );

  const showFeedback = (
    item: FeedbackItem
  ) => {

    setFeedback(item);

    setTimeout(() => {

      setFeedback(null);

    }, 2600);

  };

  return (

    <CartFeedbackContext.Provider
      value={{
        feedback,
        showFeedback,
      }}
    >

      {children}

    </CartFeedbackContext.Provider>

  );

}

export const useCartFeedback =
  () =>
    useContext(
      CartFeedbackContext
    );