module variable::LotterySystem {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use std::vector;

    /// Struct representing a lottery pool
    struct Lottery has store, key {
        participants: vector<address>,  // List of participants
        ticket_price: u64,             // Price per lottery ticket
        total_pool: u64,               // Total prize pool
        is_active: bool,               // Whether lottery is accepting tickets
        end_time: u64,                 // When lottery ends
    }

    /// Function to create a new lottery with ticket price and duration
    public fun create_lottery(
        owner: &signer, 
        ticket_price: u64, 
        duration_seconds: u64
    ) {
        let current_time = timestamp::now_seconds();
        let lottery = Lottery {
            participants: vector::empty<address>(),
            ticket_price,
            total_pool: 0,
            is_active: true,
            end_time: current_time + duration_seconds,
        };
        move_to(owner, lottery);
    }

    /// Function to buy a lottery ticket
    public fun buy_ticket(
        buyer: &signer, 
        lottery_owner: address
    ) acquires Lottery {
        let buyer_addr = signer::address_of(buyer);
        let lottery = borrow_global_mut<Lottery>(lottery_owner);
        
        // Check if lottery is still active and not expired
        assert!(lottery.is_active, 1);
        assert!(timestamp::now_seconds() < lottery.end_time, 2);
        
        // Transfer ticket price to lottery owner
        let payment = coin::withdraw<AptosCoin>(buyer, lottery.ticket_price);
        coin::deposit<AptosCoin>(lottery_owner, payment);
        
        // Add participant to the lottery
        vector::push_back(&mut lottery.participants, buyer_addr);
        lottery.total_pool = lottery.total_pool + lottery.ticket_price;
    }
}