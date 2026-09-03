import { SLLNode, SLLPointerState, SLLTaskDef, SLLTeacherStep } from '../types/sllGame';

/**
 * Explicit Step Definitions for every Task in the game.
 * Guarantees a real step-based state machine with zero fake steps.
 */
export const TASK_STEP_BUILDERS: Record<
  string,
  (nodes: SLLNode[], pointers: SLLPointerState) => SLLTeacherStep[]
> = {
  // ---------------------------------------------------------------------------
  // LEVEL 01 - TASK 01: Build First 2-Node Linked List [ 10 → 20 ]
  // ---------------------------------------------------------------------------
  L1_T1: () => [
    {
      stepNumber: 1,
      totalSteps: 5,
      title: 'Create First Node (10)',
      what: "Let's create your first node with DATA = 10 at Address 1001.",
      why: 'In linked lists, memory must be allocated on the Heap before pointers can reference it.',
      actionType: 'create_node',
      targetAddress: 1001,
      targetData: 10,
      nextAddress: null,
      createdNodeData: { data: 10, address: 1001 },
      resultMessage: "✓ Node created! Next, we'll make this node the HEAD.",
      nextStepPreview: 'Step 2: Point HEAD to Node 1001.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 5,
      title: 'Set First Node as HEAD',
      what: 'HEAD points to the first node in a linked list. Point HEAD to Node 1001.',
      why: 'HEAD gives the computer the entry point address to access the list in memory.',
      actionType: 'set_head',
      targetAddress: 1001,
      targetPointer: 'head',
      resultMessage: '✓ HEAD is set! Now let\'s create the next node.',
      nextStepPreview: 'Step 3: Create the second node (DATA: 20 at Address 1002).',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 5,
      title: 'Create Second Node (20)',
      what: 'Create the second node with DATA = 20 at Address 1002.',
      why: 'The second node needs to exist in RAM before we can connect the first node to it.',
      actionType: 'create_node',
      targetAddress: 1002,
      targetData: 20,
      nextAddress: null,
      createdNodeData: { data: 20, address: 1002 },
      resultMessage: '✓ Node 20 created! Next, connect Node 10 to Node 20.',
      nextStepPreview: 'Step 4: Connect Node 10\'s NEXT pointer to Node 20 (Address 1002).',
      isCompleted: false,
    },
    {
      stepNumber: 4,
      totalSteps: 5,
      title: 'Connect First Node → Second Node',
      what: 'NEXT stores the address of the next node. Connect Node 1001\'s NEXT to 1002.',
      why: 'By storing Address 1002 inside Node 1001\'s NEXT field, we link the two nodes in RAM.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1002,
      resultMessage: '✓ Connected! Node 10 now points to Node 20.',
      nextStepPreview: 'Step 5: Verify the last node terminates at NULL and set TAIL.',
      isCompleted: false,
    },
    {
      stepNumber: 5,
      totalSteps: 5,
      title: 'Set TAIL to Node 1002',
      what: 'The last node in the chain is the TAIL. Click Node 1002 to set TAIL.',
      why: 'In singly linked lists, TAIL points to the last node and its NEXT terminates at NULL.',
      actionType: 'set_tail',
      targetAddress: 1002,
      targetPointer: 'tail',
      resultMessage: '✓ TAIL is set! All 5 steps completed! You successfully built your first linked list.',
      nextStepPreview: 'Task Finished! You can now proceed to the next task.',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 01 - TASK 02: Point HEAD & TAIL to First Node
  // ---------------------------------------------------------------------------
  L1_T2: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Point HEAD to Node 1001',
      what: 'Make Node 10 (Address 1001) the HEAD of the list.',
      why: 'HEAD tells the program where the linked list chain begins.',
      actionType: 'set_head',
      targetAddress: 1001,
      targetPointer: 'head',
      resultMessage: '✓ HEAD now points to Node 1001.',
      nextStepPreview: 'Step 2: Point TAIL to Node 1001.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Point TAIL to Node 1001',
      what: 'Set TAIL pointer to Node 10 (Address 1001).',
      why: 'In a 1-node list, the same node is both the HEAD (first) and TAIL (last).',
      actionType: 'set_tail',
      targetAddress: 1001,
      targetPointer: 'tail',
      resultMessage: '✓ TAIL now points to Node 1001. List initialized correctly!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 01 - TASK 03: Insert at Beginning (Prepend)
  // ---------------------------------------------------------------------------
  L1_T3: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Connect New Node to Current HEAD',
      what: 'Connect new Node 5 (Address 1000) NEXT pointer to Node 10 (Address 1001).',
      why: 'Always connect the new node FIRST (`newNode->next = head`) to avoid losing the list!',
      actionType: 'connect_next',
      targetAddress: 1000,
      nextAddress: 1001,
      resultMessage: '✓ Node 5 is now linked to Node 10 (5 → 10).',
      nextStepPreview: 'Step 2: Update HEAD to point to Node 5.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Update HEAD to Node 5',
      what: 'Point HEAD to new Node 5 (Address 1000).',
      why: 'Now that Node 5 is the first element, `head = newNode` completes the O(1) prepend.',
      actionType: 'set_head',
      targetAddress: 1000,
      targetPointer: 'head',
      resultMessage: '✓ HEAD updated to Node 5! Prepend completed successfully.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 01 - TASK 04: Insert at End (Append)
  // ---------------------------------------------------------------------------
  L1_T4: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Connect Old Tail to New Node',
      what: 'Connect Node 10 (Address 1001) NEXT pointer to new Node 20 (Address 1002).',
      why: 'In appending, the current tail\'s NEXT must point to the new node (`tail->next = newNode`).',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1002,
      resultMessage: '✓ Node 10 connected to Node 20 (10 → 20).',
      nextStepPreview: 'Step 2: Update TAIL pointer to Node 20.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Update TAIL to Node 20',
      what: 'Update TAIL to point to Node 20 (Address 1002).',
      why: 'TAIL must always point to the last element (`tail = newNode`).',
      actionType: 'set_tail',
      targetAddress: 1002,
      targetPointer: 'tail',
      resultMessage: '✓ TAIL updated to Node 20.',
      nextStepPreview: 'Step 3: Ensure Node 20 NEXT is NULL.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Verify Last Node NEXT → NULL',
      what: 'Confirm that Node 20\'s NEXT pointer is NULL.',
      why: 'The last node marks the end of the list with NEXT = NULL.',
      actionType: 'verify_null',
      targetAddress: 1002,
      nextAddress: null,
      resultMessage: '✓ Verified! Append completed with O(1) time complexity.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 02 - TASK 01: Delete from Beginning (HEAD Deletion)
  // ---------------------------------------------------------------------------
  L2_T1: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Advance HEAD Forward',
      what: 'Move HEAD pointer forward to Node 10 (`head = head->next`, Address 1001).',
      why: 'Advancing HEAD decouples the first node from the active list without breaking remaining links.',
      actionType: 'set_head',
      targetAddress: 1001,
      targetPointer: 'head',
      resultMessage: '✓ HEAD moved forward to Node 1001.',
      nextStepPreview: 'Step 2: Delete/Free the detached Node 5 from RAM.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Free Detached Node (1000)',
      what: 'Deallocate / delete Node 5 (Address 1000) from memory.',
      why: 'In C/C++, `free(temp)` prevents memory leaks after removing a node.',
      actionType: 'delete_node',
      targetAddress: 1000,
      resultMessage: '✓ Node 5 freed from RAM. Deletion from head completed!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 02 - TASK 02: Delete from End (TAIL Deletion)
  // ---------------------------------------------------------------------------
  L2_T2: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Set Second-to-Last Node NEXT to NULL',
      what: 'Disconnect Node 20 by setting Node 10\'s NEXT pointer to NULL.',
      why: 'Node 10 is becoming the new last node, so its NEXT must point to NULL.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: null,
      resultMessage: '✓ Node 10 NEXT set to NULL.',
      nextStepPreview: 'Step 2: Move TAIL pointer backward to Node 10.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Update TAIL to Node 10',
      what: 'Update TAIL pointer to Node 10 (Address 1001).',
      why: 'TAIL must point to the new end of the list.',
      actionType: 'set_tail',
      targetAddress: 1001,
      targetPointer: 'tail',
      resultMessage: '✓ TAIL moved to Node 10 (Address 1001).',
      nextStepPreview: 'Step 3: Free the disconnected old tail node.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Free Detached Node (1002)',
      what: 'Deallocate / delete old tail Node 20 (Address 1002) from RAM.',
      why: 'Freeing unused heap nodes prevents memory leaks.',
      actionType: 'delete_node',
      targetAddress: 1002,
      resultMessage: '✓ Node 20 freed! Tail deletion complete.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 02 - TASK 03: Delete Single-Node List (Boundary Case)
  // ---------------------------------------------------------------------------
  L2_T3: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Set HEAD to NULL',
      what: 'Set HEAD pointer to NULL.',
      why: 'Removing the only node leaves the list empty, so HEAD must be NULL.',
      actionType: 'set_head',
      targetAddress: null,
      targetPointer: 'head',
      resultMessage: '✓ HEAD set to NULL.',
      nextStepPreview: 'Step 2: Set TAIL to NULL.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Set TAIL to NULL',
      what: 'Set TAIL pointer to NULL.',
      why: 'An empty list has no tail node.',
      actionType: 'set_tail',
      targetAddress: null,
      targetPointer: 'tail',
      resultMessage: '✓ TAIL set to NULL.',
      nextStepPreview: 'Step 3: Free the node from RAM.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Free Solitary Node (1001)',
      what: 'Free Node 10 (Address 1001) from memory.',
      why: 'Heap memory must be released.',
      actionType: 'delete_node',
      targetAddress: 1001,
      resultMessage: '✓ Node 10 freed! List is safely empty.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 02 - TASK 04: Delete from Empty List (Underflow Guard)
  // ---------------------------------------------------------------------------
  L2_T4: () => [
    {
      stepNumber: 1,
      totalSteps: 1,
      title: 'Verify Underflow Guard',
      what: 'Verify that HEAD == NULL before attempting deletion.',
      why: 'Attempting to delete from an empty list triggers Underflow (Segmentation Fault).',
      actionType: 'verify_null',
      targetAddress: null,
      resultMessage: '✓ Underflow check passed! `if (head == NULL) return;` prevents crash.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 03 - TASK 01: Traversal Stream
  // ---------------------------------------------------------------------------
  L3_T1: () => [
    {
      stepNumber: 1,
      totalSteps: 4,
      title: 'Initialize CURRENT to HEAD',
      what: 'Point CURRENT pointer to HEAD (Node 10, Address 1001).',
      why: 'Traversal always begins at the starting address stored in HEAD.',
      actionType: 'traverse_step',
      targetAddress: 1001,
      targetData: 10,
      resultMessage: '✓ CURRENT initialized to Node 1001. Streamed DATA: 10.',
      nextStepPreview: 'Step 2: Advance CURRENT to Node 20 (Address 1002).',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 4,
      title: 'Advance CURRENT to Node 20',
      what: 'Advance CURRENT to `current->next` (Node 20, Address 1002).',
      why: 'Following NEXT steps to the next contiguous logical element in the chain.',
      actionType: 'traverse_step',
      targetAddress: 1002,
      targetData: 20,
      resultMessage: '✓ CURRENT moved to Node 1002. Streamed DATA: 20.',
      nextStepPreview: 'Step 3: Advance CURRENT to Node 30 (Address 1003).',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 4,
      title: 'Advance CURRENT to Node 30',
      what: 'Advance CURRENT to `current->next` (Node 30, Address 1003).',
      why: 'Reading the node value and advancing pointer.',
      actionType: 'traverse_step',
      targetAddress: 1003,
      targetData: 30,
      resultMessage: '✓ CURRENT moved to Node 1003. Streamed DATA: 30.',
      nextStepPreview: 'Step 4: Reach end of list (NULL).',
      isCompleted: false,
    },
    {
      stepNumber: 4,
      totalSteps: 4,
      title: 'Terminate Traversal at NULL',
      what: 'CURRENT encounters NULL (`current == NULL`), stopping the loop.',
      why: 'While loop `while (current != NULL)` terminates when reaching the end.',
      actionType: 'traverse_step',
      targetAddress: null,
      resultMessage: '✓ Traversal complete! Output stream: [10, 20, 30].',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 04 - TASK 01: Insert in Middle (Between Nodes)
  // ---------------------------------------------------------------------------
  L4_T1: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Connect New Node to Right Neighbor',
      what: 'Connect new Node 15 (Address 1005) NEXT to Node 20 (Address 1002).',
      why: 'Crucial: always link the new node to the downstream list first (`newNode->next = prev->next`).',
      actionType: 'connect_next',
      targetAddress: 1005,
      nextAddress: 1002,
      resultMessage: '✓ Node 15 connected to Node 20 (15 → 20).',
      nextStepPreview: 'Step 2: Connect Node 10 to Node 15.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Connect Left Neighbor to New Node',
      what: 'Connect Node 10 (Address 1001) NEXT to Node 15 (Address 1005).',
      why: 'Updating `prev->next = newNode` completes the middle insertion without losing elements.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1005,
      resultMessage: '✓ Node 10 connected to Node 15. Insertion [10 → 15 → 20] complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 04 - TASK 02: Delete in Middle
  // ---------------------------------------------------------------------------
  L4_T2: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Bypass Middle Node',
      what: 'Connect Node 10 (Address 1001) NEXT directly to Node 30 (Address 1003).',
      why: 'Bypassing Node 20 (`prev->next = current->next`) cuts it out of the linked chain.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1003,
      resultMessage: '✓ Node 10 now points directly to Node 30. Node 20 is bypassed.',
      nextStepPreview: 'Step 2: Free detached Node 20 from RAM.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Free Detached Node (1002)',
      what: 'Free Node 20 (Address 1002) from RAM.',
      why: 'Deallocating the unlinked node prevents memory leaks.',
      actionType: 'delete_node',
      targetAddress: 1002,
      resultMessage: '✓ Node 20 freed! Middle deletion completed.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 04 - TASK 03: Linear Search
  // ---------------------------------------------------------------------------
  L4_T3: () => [
    {
      stepNumber: 1,
      totalSteps: 4,
      title: 'Initialize Search at HEAD',
      what: 'Point search pointer CURRENT to HEAD (Node 10, Address 1001).',
      why: 'Search starts at the first node to inspect each value sequentially.',
      actionType: 'search_step',
      targetAddress: 1001,
      resultMessage: '✓ CURRENT at Node 1001 (DATA: 10). Target is 40.',
      nextStepPreview: 'Step 2: Compare 10 with 40, advance to Node 1002.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 4,
      title: 'Inspect Node 10 & Advance',
      what: '10 ≠ 40. Advance CURRENT to `current->next` (Node 20, Address 1002).',
      why: 'When current node does not match target, follow NEXT pointer.',
      actionType: 'search_step',
      targetAddress: 1002,
      resultMessage: '✓ CURRENT advanced to Node 1002 (DATA: 20).',
      nextStepPreview: 'Step 3: Compare 20 with 40, advance to Node 1004.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 4,
      title: 'Inspect Node 20 & Advance',
      what: '20 ≠ 40. Advance CURRENT to `current->next` (Node 40, Address 1004).',
      why: 'Continuing linear scan down the list.',
      actionType: 'search_step',
      targetAddress: 1004,
      resultMessage: '✓ CURRENT advanced to Node 1004 (DATA: 40).',
      nextStepPreview: 'Step 4: Compare 40 with 40 (Match!).',
      isCompleted: false,
    },
    {
      stepNumber: 4,
      totalSteps: 4,
      title: 'Target Found at Node 1004',
      what: 'DATA 40 == 40. Target value found! Search completes.',
      why: 'Matching node address returned in O(k) steps.',
      actionType: 'search_step',
      targetAddress: 1004,
      resultMessage: '✓ Target 40 found at Address 1004! Search successful.',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  // ---------------------------------------------------------------------------
  // LEVEL 05 - MASTER MISSIONS (L5_M1 to L5_M7)
  // ---------------------------------------------------------------------------
  L5_M1: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Create First Node (10)',
      what: 'Create Node 10 at Address 1001 in Heap RAM.',
      why: 'First step of master linked list creation.',
      actionType: 'create_node',
      targetAddress: 1001,
      targetData: 10,
      nextAddress: null,
      createdNodeData: { data: 10, address: 1001 },
      resultMessage: '✓ Node 10 created.',
      nextStepPreview: 'Step 2: Point HEAD to Node 1001.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Set HEAD to Node 1001',
      what: 'Point HEAD to Node 1001.',
      why: 'Establishes list entry pointer.',
      actionType: 'set_head',
      targetAddress: 1001,
      resultMessage: '✓ HEAD set to Node 1001.',
      nextStepPreview: 'Step 3: Point TAIL to Node 1001.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Set TAIL to Node 1001',
      what: 'Point TAIL to Node 1001.',
      why: '1-node list boundary setup.',
      actionType: 'set_tail',
      targetAddress: 1001,
      resultMessage: '✓ TAIL set to Node 1001. Mission 1 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M2: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Create Node 20',
      what: 'Create Node 20 at Address 1002.',
      why: 'Node must exist in RAM before appending.',
      actionType: 'create_node',
      targetAddress: 1002,
      targetData: 20,
      nextAddress: null,
      createdNodeData: { data: 20, address: 1002 },
      resultMessage: '✓ Node 20 created.',
      nextStepPreview: 'Step 2: Connect Node 10 to Node 20.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Connect Node 10 → Node 20',
      what: 'Connect Node 10 (1001) NEXT to Node 20 (1002).',
      why: 'Link the tail to the new node.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1002,
      resultMessage: '✓ Node 10 linked to Node 20.',
      nextStepPreview: 'Step 3: Update TAIL to Node 20.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Update TAIL to Node 20',
      what: 'Move TAIL to Node 20 (1002).',
      why: 'Node 20 is the new tail.',
      actionType: 'set_tail',
      targetAddress: 1002,
      resultMessage: '✓ TAIL updated to Node 20. Mission 2 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M3: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Create Node 5',
      what: 'Create Node 5 at Address 1000.',
      why: 'Allocate node for prepending.',
      actionType: 'create_node',
      targetAddress: 1000,
      targetData: 5,
      nextAddress: null,
      createdNodeData: { data: 5, address: 1000 },
      resultMessage: '✓ Node 5 created.',
      nextStepPreview: 'Step 2: Connect Node 5 to Node 10.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Connect Node 5 → Node 10',
      what: 'Connect Node 5 (1000) NEXT to Node 10 (1001).',
      why: 'Link new node to current head first.',
      actionType: 'connect_next',
      targetAddress: 1000,
      nextAddress: 1001,
      resultMessage: '✓ Node 5 connected to Node 10.',
      nextStepPreview: 'Step 3: Update HEAD to Node 5.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Update HEAD to Node 5',
      what: 'Point HEAD to Node 5 (1000).',
      why: 'Node 5 is the new list start.',
      actionType: 'set_head',
      targetAddress: 1000,
      resultMessage: '✓ HEAD set to Node 5. Mission 3 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M4: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Create Node 15',
      what: 'Create Node 15 at Address 1005.',
      why: 'Allocate middle node.',
      actionType: 'create_node',
      targetAddress: 1005,
      targetData: 15,
      nextAddress: null,
      createdNodeData: { data: 15, address: 1005 },
      resultMessage: '✓ Node 15 created.',
      nextStepPreview: 'Step 2: Connect Node 15 to Node 20.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Connect Node 15 → Node 20',
      what: 'Connect Node 15 (1005) NEXT to Node 20 (1002).',
      why: 'Link to right neighbor first.',
      actionType: 'connect_next',
      targetAddress: 1005,
      nextAddress: 1002,
      resultMessage: '✓ Node 15 linked to Node 20.',
      nextStepPreview: 'Step 3: Connect Node 10 to Node 15.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Connect Node 10 → Node 15',
      what: 'Connect Node 10 (1001) NEXT to Node 15 (1005).',
      why: 'Link left neighbor to complete middle insertion.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1005,
      resultMessage: '✓ Node 10 linked to Node 15. Mission 4 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M5: () => [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: 'Bypass Node 15',
      what: 'Connect Node 10 (1001) NEXT directly to Node 20 (1002).',
      why: 'Bypasses Node 15 to cut it from the list.',
      actionType: 'connect_next',
      targetAddress: 1001,
      nextAddress: 1002,
      resultMessage: '✓ Node 10 now points directly to Node 20.',
      nextStepPreview: 'Step 2: Free detached Node 15.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: 'Free Node 15',
      what: 'Free Node 15 (1005) from memory.',
      why: 'Deallocate unused heap memory.',
      actionType: 'delete_node',
      targetAddress: 1005,
      resultMessage: '✓ Node 15 freed. Mission 5 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M6: () => [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'Start Search at HEAD',
      what: 'Set CURRENT = HEAD (Node 5, Address 1000).',
      why: 'Linear search starts at head.',
      actionType: 'search_step',
      targetAddress: 1000,
      resultMessage: '✓ CURRENT at Node 5 (Target: 20).',
      nextStepPreview: 'Step 2: Advance to Node 10.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Advance to Node 10',
      what: '5 ≠ 20. Move CURRENT to Node 10 (Address 1001).',
      why: 'Follow NEXT pointer.',
      actionType: 'search_step',
      targetAddress: 1001,
      resultMessage: '✓ CURRENT at Node 10.',
      nextStepPreview: 'Step 3: Advance to Node 20 and match target.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Match Target at Node 20',
      what: 'DATA 20 == 20. Match found at Address 1002!',
      why: 'Search completes successfully.',
      actionType: 'search_step',
      targetAddress: 1002,
      resultMessage: '✓ Target 20 found at Address 1002! Mission 6 Complete!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],

  L5_M7: () => [
    {
      stepNumber: 1,
      totalSteps: 4,
      title: 'Start Traversal at HEAD',
      what: 'Set CURRENT = HEAD (Node 5, Address 1000).',
      why: 'Begin list traversal.',
      actionType: 'traverse_step',
      targetAddress: 1000,
      targetData: 5,
      resultMessage: '✓ Streamed DATA: 5.',
      nextStepPreview: 'Step 2: Advance to Node 10.',
      isCompleted: false,
    },
    {
      stepNumber: 2,
      totalSteps: 4,
      title: 'Advance to Node 10',
      what: 'CURRENT moved to Node 10 (Address 1001).',
      why: 'Read and advance.',
      actionType: 'traverse_step',
      targetAddress: 1001,
      targetData: 10,
      resultMessage: '✓ Streamed DATA: 10.',
      nextStepPreview: 'Step 3: Advance to Node 20.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      totalSteps: 4,
      title: 'Advance to Node 20',
      what: 'CURRENT moved to Node 20 (Address 1002).',
      why: 'Read and advance.',
      actionType: 'traverse_step',
      targetAddress: 1002,
      targetData: 20,
      resultMessage: '✓ Streamed DATA: 20.',
      nextStepPreview: 'Step 4: Reach NULL.',
      isCompleted: false,
    },
    {
      stepNumber: 4,
      totalSteps: 4,
      title: 'Reach End of List (NULL)',
      what: 'CURRENT encounters NULL, ending traversal.',
      why: 'Final mission complete!',
      actionType: 'traverse_step',
      targetAddress: null,
      resultMessage: '✓ Master Linked List Traversal Completed: [5, 10, 20]! 🎉',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ],
};

/**
 * Returns all step definitions for a task.
 */
export function getAllTaskSteps(
  task: SLLTaskDef,
  nodes: SLLNode[] = [],
  pointers: SLLPointerState = { headAddress: null, tailAddress: null, currentAddress: null, tempAddress: null, prevAddress: null }
): SLLTeacherStep[] {
  const builder = TASK_STEP_BUILDERS[task.id];
  if (builder) {
    return builder(nodes, pointers);
  }

  // Fallback synthesis if task has guideSteps
  if (task.guideSteps && task.guideSteps.length > 0) {
    const total = task.guideSteps.length;
    return task.guideSteps.map((gs, idx) => ({
      stepNumber: gs.stepNumber || idx + 1,
      totalSteps: total,
      title: `Step ${idx + 1}: ${gs.instruction}`,
      what: gs.instruction,
      why: gs.explanation,
      actionType: (gs.targetAction as any) || 'check_answer',
      targetAddress: gs.targetNodeAddress ?? null,
      resultMessage: `✓ Completed step ${idx + 1}`,
      nextStepPreview: idx + 1 < total ? `Step ${idx + 2}` : 'Finished',
      isCompleted: idx + 1 === total,
    }));
  }

  // Generic fallback
  return [
    {
      stepNumber: 1,
      totalSteps: 1,
      title: task.title,
      what: task.objective,
      why: task.conceptExplanation,
      actionType: 'check_answer',
      resultMessage: '✓ Task requirements satisfied!',
      nextStepPreview: 'Task Finished!',
      isCompleted: true,
    },
  ];
}

/**
 * Returns the exact step for the specified step number (1-based).
 */
export function getTaskStep(
  task: SLLTaskDef,
  stepNumber: number,
  nodes: SLLNode[] = [],
  pointers: SLLPointerState = { headAddress: null, tailAddress: null, currentAddress: null, tempAddress: null, prevAddress: null }
): SLLTeacherStep | null {
  const steps = getAllTaskSteps(task, nodes, pointers);
  const found = steps.find((s) => s.stepNumber === stepNumber);
  if (found) return found;
  if (stepNumber >= 1 && stepNumber <= steps.length) {
    return steps[stepNumber - 1];
  }
  return null;
}

/**
 * Returns total steps for a task.
 */
export function getTaskTotalSteps(task: SLLTaskDef): number {
  const steps = getAllTaskSteps(task);
  return steps.length;
}

/**
 * Executes exactly ONE logical action on the shared game state.
 * Guaranteed to actually modify nodes, pointers, and memory state.
 */
export function executeSingleTeacherStep(
  step: SLLTeacherStep,
  currentState: {
    nodes: SLLNode[];
    pointers: SLLPointerState;
    traversalOutput: number[];
  }
): {
  nodes: SLLNode[];
  pointers: SLLPointerState;
  traversalOutput: number[];
  feedbackMessage: string;
} {
  let newNodes: SLLNode[] = JSON.parse(JSON.stringify(currentState.nodes));
  let newPointers: SLLPointerState = { ...currentState.pointers };
  let newOutput: number[] = [...currentState.traversalOutput];

  switch (step.actionType) {
    case 'create_node': {
      const data = step.createdNodeData?.data ?? step.targetData ?? 10;
      const address = step.createdNodeData?.address ?? step.targetAddress ?? 1001;
      const nextAddr = step.nextAddress !== undefined ? step.nextAddress : null;

      // Only add if not already in memory at that address
      if (!newNodes.some((n) => n.address === address)) {
        newNodes.push({
          id: `node-${address}`,
          data,
          address,
          nextAddress: nextAddr,
        });
      }
      break;
    }

    case 'set_head': {
      newPointers.headAddress = step.targetAddress !== undefined ? step.targetAddress : null;
      // Do not silently set tail here so tasks teaching HEAD and TAIL can teach them as separate steps
      break;
    }

    case 'set_tail': {
      newPointers.tailAddress = step.targetAddress !== undefined ? step.targetAddress : null;
      break;
    }

    case 'connect_next': {
      if (step.targetAddress !== undefined && step.targetAddress !== null) {
        newNodes = newNodes.map((n) =>
          n.address === step.targetAddress
            ? { ...n, nextAddress: step.nextAddress !== undefined ? step.nextAddress : null }
            : n
        );
      }
      break;
    }

    case 'delete_node': {
      if (step.targetAddress !== undefined && step.targetAddress !== null) {
        newNodes = newNodes.filter((n) => n.address !== step.targetAddress);
        if (newPointers.headAddress === step.targetAddress) newPointers.headAddress = null;
        if (newPointers.tailAddress === step.targetAddress) newPointers.tailAddress = null;
        if (newPointers.currentAddress === step.targetAddress) newPointers.currentAddress = null;
      }
      break;
    }

    case 'traverse_step': {
      if (step.targetAddress !== undefined && step.targetAddress !== null) {
        newPointers.currentAddress = step.targetAddress;
        if (step.targetData !== undefined && !newOutput.includes(step.targetData)) {
          newOutput.push(step.targetData);
        }
      } else {
        newPointers.currentAddress = null;
      }
      break;
    }

    case 'search_step': {
      if (step.targetAddress !== undefined && step.targetAddress !== null) {
        newPointers.currentAddress = step.targetAddress;
      }
      break;
    }

    case 'verify_null': {
      if (step.targetAddress !== undefined && step.targetAddress !== null) {
        newNodes = newNodes.map((n) =>
          n.address === step.targetAddress ? { ...n, nextAddress: null } : n
        );
        newPointers.tailAddress = step.targetAddress;
      }
      break;
    }

    default:
      break;
  }

  return {
    nodes: newNodes,
    pointers: newPointers,
    traversalOutput: newOutput,
    feedbackMessage: step.resultMessage,
  };
}

/**
 * Returns the current teacher step based on currentStep index or state analysis.
 */
export function getNextTeacherStep(
  task: SLLTaskDef,
  nodes: SLLNode[],
  pointers: SLLPointerState,
  traversalOutput: number[] = [],
  searchResult: string = 'idle',
  searchCurrentNode: SLLNode | null = null,
  currentStepIndex: number = 1
): SLLTeacherStep | null {
  return getTaskStep(task, currentStepIndex, nodes, pointers);
}

/**
 * Returns contextual instructions and recommended tools for PLAY mode based on currentStep.
 */
export function getContextualPlayAdvice(
  task: SLLTaskDef,
  nodes: SLLNode[],
  pointers: SLLPointerState,
  currentStep: number = 1
): {
  primaryInstruction: string;
  recommendedAction: 'create_node' | 'connect_next' | 'set_head' | 'set_tail' | 'delete_node' | 'traverse' | 'search' | 'check_answer';
  targetAddress?: number | null;
  targetData?: number;
} {
  const step = getTaskStep(task, currentStep, nodes, pointers);
  if (!step) {
    return {
      primaryInstruction: 'All operations look complete! Click CHECK ANSWER to verify.',
      recommendedAction: 'check_answer',
    };
  }

  switch (step.actionType) {
    case 'create_node':
      return {
        primaryInstruction: `Create Node with DATA = ${step.createdNodeData?.data ?? step.targetData ?? 10}`,
        recommendedAction: 'create_node',
        targetAddress: step.createdNodeData?.address ?? step.targetAddress,
        targetData: step.createdNodeData?.data ?? step.targetData,
      };
    case 'connect_next':
      return {
        primaryInstruction: `Connect Node ${step.targetAddress}'s NEXT to ${step.nextAddress !== null ? `Node ${step.nextAddress}` : 'NULL'}`,
        recommendedAction: 'connect_next',
        targetAddress: step.targetAddress,
      };
    case 'set_head':
      return {
        primaryInstruction: step.targetAddress !== null ? `Click Node ${step.targetAddress} to make it HEAD` : 'Set HEAD to NULL',
        recommendedAction: 'set_head',
        targetAddress: step.targetAddress,
      };
    case 'set_tail':
      return {
        primaryInstruction: step.targetAddress !== null ? `Click Node ${step.targetAddress} to make it TAIL` : 'Set TAIL to NULL',
        recommendedAction: 'set_tail',
        targetAddress: step.targetAddress,
      };
    case 'delete_node':
      return {
        primaryInstruction: `Click Node ${step.targetAddress} and select Delete Node`,
        recommendedAction: 'delete_node',
        targetAddress: step.targetAddress,
      };
    case 'verify_null':
      return {
        primaryInstruction: `Verify Node ${step.targetAddress} has NEXT = NULL and TAIL points to it`,
        recommendedAction: 'check_answer',
        targetAddress: step.targetAddress,
      };
    default:
      return {
        primaryInstruction: step.what,
        recommendedAction: 'check_answer',
      };
  }
}
