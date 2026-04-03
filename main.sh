#!/bin/bash
export DB_URL=
export ADMIN_ID=
export PHONE_NUMBER=
# dirname $0
echo "1. DELIVERY_ROW (order_id,date_interval,modify)"
echo "2. CX_RTO_PREDELIVERY RECON (db_phone_number,ofd_date,modify)"
echo "3. CANT RAISE RVP - MARKING ISSUE (order_id,modify)"
echo "4. Order Info (order_id)"
echo "5. Admin Token"
echo "Choose an option"
SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
# echo $SCRIPT_DIR
JS_FILE=""
# Taking all inputs in a array in a single line
read -a vars -p "Enter the values (space separated): "
if [ ${vars[0]} -eq 1 ]; then
    echo "Running DELIVERY_ROW"
    JS_FILE="$SCRIPT_DIR/delivery_row.js"
elif [ ${vars[0]} -eq 2 ]; then
    echo "Running CX_RTO_PREDELIVERY"
    JS_FILE="$SCRIPT_DIR/cx_rto_predelivery_recon.js"
elif [ ${vars[0]} -eq 3 ]; then
    echo "Running CANT_RAISE_RVP - MARKING ISSUE"
    JS_FILE="$SCRIPT_DIR/rvp_marking_issue.js"
elif [ ${vars[0]} -eq 4 ]; then
    echo "Running ORDER_INFO"
    JS_FILE="$SCRIPT_DIR/info.js"
elif [ ${vars[0]} -eq 5 ]; then
    echo "Running ADMIN_TOKEN"
    JS_FILE="$SCRIPT_DIR/admin_token.js"
fi

# Slicing Array Vars - from index 1 to end
# Slicing - Removing last element - unset "arr[-1]"
args_send=(${vars[@]:1})
echo Running $JS_FILE with args ${args_send[@]}
# Sending array as separated arguments
node $JS_FILE ${args_send[@]}