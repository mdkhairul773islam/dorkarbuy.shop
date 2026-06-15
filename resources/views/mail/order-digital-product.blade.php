<x-mail::message>
# আপনার অর্ডার সম্পন্ন হয়েছে!

প্রিয় **{{ $order->customer_name }}**,

আপনার অর্ডার **#{{ $order->order_number }}** সফলভাবে গ্রহণ করা হয়েছে।
আপনার ক্রয়কৃত ডিজিটাল ফাইলগুলো এই ইমেইলের সাথে **সংযুক্ত** করা আছে।

---

## অর্ডার বিবরণ

| পণ্য | পরিমাণ | মূল্য |
|:-----|:------:|------:|
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | ৳{{ number_format($item->total, 2) }} |
@endforeach

**মোট:** ৳{{ number_format($order->total, 2) }}

---

ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য।

ধন্যবাদ,
{{ config('app.name') }}
</x-mail::message>
