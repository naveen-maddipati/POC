/**
 * Nuxeo Automation Operations Constants
 * 
 * Auto-generated from Nuxeo server API
 * Generated: 2025-10-21T19:01:45.834Z
 * Server: http://localhost:8080/nuxeo
 * 
 * 📊 GENERATION STATISTICS:
 * ========================
 * Total Operations Fetched: 273
 * Total Constants Generated: 357
 * Duplicates Resolved: 0
 * Aliases Processed: 84
 * 
 * 📈 OPERATIONS BY CATEGORY:
 * =========================
 * Business: 3 operations
 * Chain: 29 operations
 * Conversion: 25 operations
 * Document: 82 operations
 * Execution Context: 15 operations
 * Execution Flow: 13 operations
 * Fetch: 17 operations
 * Files: 32 operations
 * Local Configuration: 3 operations
 * Notification: 6 operations
 * Push & Pop: 24 operations
 * Routing: 2 operations
 * Scripting: 4 operations
 * Services: 68 operations
 * User Interface: 1 operations
 * Users & Groups: 16 operations
 * Workflow Context: 17 operations
 * 
 * 🔢 CONSTANT COUNTS:
 * ==================
 * NUXEO_OPERATIONS: 357 properties
 * NUXEO_OPERATION_CATEGORIES: 17 categories
 * NUXEO_OPERATION_ALIASES: 84 aliases
 * 
 * 🏷️ PROCESSING DETAILS:
 * ======================
 * Successfully Processed: 357
 * Duplicates Found: 0
 * Aliases Created: 84
 * Categories Identified: 17
 * 
 * DO NOT EDIT MANUALLY - This file is auto-generated
 * Use 'npm run constants:generate' to regenerate
 */

/**
 * Nuxeo Automation Operations (357 operations)
 * 
 * Auto-generated operation constants for Nuxeo automation calls.
 * Each constant represents a server-side automation operation.
 */
export const NUXEO_OPERATIONS = {
  /** acceptComment */
  acceptComment: 'acceptComment',
  /** List available actions - Retrieve list of available actions for a given category. Action context is built based on the Operation context (currentDocument will be fetched from Context if not provided as input). If this operation is executed in a chain that initialized the Seam context, it will be used for Action context */
  Actions_GET: 'Actions.GET',
  /** Add entry into multi-valued metadata - Add value into the field expressed by the xpath parameter. This field must be a multivalued metadata.<p> 'checkExists' parameter enables to add value only if doesn't already exists in the field: <ul><li> if checked, the value will not be added if it exists already in the list</li><li>if not checked the value will be always added</li</ul>.<p> Remark: <b>only works for a field that stores a list of scalars (string, boolean, date, int, long) and not list of complex types.</b></p><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> (Alias for Document.AddEntryToMultivaluedProperty) */
  AddEntryToMultivaluedProperty: 'AddEntryToMultivaluedProperty',
  /** AttachFiles */
  AttachFiles: 'AttachFiles',
  /** Log Event In Audit - Log events into audit for each of the input document. The operation accept as input one ore more documents that are returned back as the output. (Alias for Audit.LogEvent) */
  Audit_Log: 'Audit.Log',
  /** Log Event In Audit - Log events into audit for each of the input document. The operation accept as input one ore more documents that are returned back as the output. */
  Audit_LogEvent: 'Audit.LogEvent',
  /** Audit Query With Page Provider - Perform a query or a named provider query against Audit logs. Result is paginated. The query result will become the input for the next operation. If no query or provider name is given, a query based on default Audit page provider will be executed. (Alias for Audit.QueryWithPageProvider) */
  Audit_PageProvider: 'Audit.PageProvider',
  /** Audit Query With Page Provider - Perform a query or a named provider query against Audit logs. Result is paginated. The query result will become the input for the next operation. If no query or provider name is given, a query based on default Audit page provider will be executed. */
  Audit_QueryWithPageProvider: 'Audit.QueryWithPageProvider',
  /** Restore log entries - Restore log entries from an audit storage implementation to the audit backend. */
  Audit_Restore: 'Audit.Restore',
  /** Login As - Login As the given user. If no user is given a system login is performed. This is a void operations - the input will be returned back as the output. */
  Auth_LoginAs: 'Auth.LoginAs',
  /** Logout - Perform a logout. This should be used only after using the Login As operation to restore original login. This is a void operations - the input will be returned back as the output. */
  Auth_Logout: 'Auth.Logout',
  /** Read Metadata From Binary - Read Metadata From Binary with the default Nuxeo processor. (Alias for Blob.ReadMetadata) */
  Binary_ReadMetadata: 'Binary.ReadMetadata',
  /** Write Metadata To Blob From Context - Write Metadata To Blob From Context given a processor name (or the default Nuxeo one) and given metadata, and return the updated Blob. (Alias for Blob.SetMetadataFromContext) */
  Binary_WriteMetadataFromContext: 'Binary.WriteMetadataFromContext',
  /** Write Metadata To Binary From Document - Write metadata to a Blob (xpath parameter, or BlobHolder if empty) from a document (input) given a custom metadata mapping defined in a Properties parameter, using a named processor (exifTool for instance). (Alias for Blob.SetMetadataFromDocument) */
  Binary_WriteMetadataFromDocument: 'Binary.WriteMetadataFromDocument',
  /** Attach File - Attach the input file to the document given as a parameter. If the xpath points to a blob list then the blob is appended to the list, otherwise the xpath should point to a blob property. If the save parameter is set the document modification will be automatically saved. Return the blob. (Alias for Blob.AttachOnDocument) */
  Blob_Attach: 'Blob.Attach',
  /** Attach File - Attach the input file to the document given as a parameter. If the xpath points to a blob list then the blob is appended to the list, otherwise the xpath should point to a blob property. If the save parameter is set the document modification will be automatically saved. Return the blob. */
  Blob_AttachOnDocument: 'Blob.AttachOnDocument',
  /** Bulk Download - Prepare a Zip of a list of documents. */
  Blob_BulkDownload: 'Blob.BulkDownload',
  /** Concatenate PDFs - Given a File document holding a pdf on the file:content property and 2 pdfs on the files:files property, the following operation will provide a pdf that is the result of the merge of all the pdfs, with the content of the one in file:content property first. */
  Blob_ConcatenatePDFs: 'Blob.ConcatenatePDFs',
  /** Convert to given mime-type - Convert the input file to a file of the given mime-type and return the new file. */
  Blob_Convert: 'Blob.Convert',
  /** File From URL - Creates a file from a given URL. The file parameter specifies how to retrieve the file content. It should be an URL to the file you want to use as the source. You can also use an expression to get an URL from the context. Returns the created file. (Alias for Blob.CreateFromURL) */
  Blob_Create: 'Blob.Create',
  /** File From URL - Creates a file from a given URL. The file parameter specifies how to retrieve the file content. It should be an URL to the file you want to use as the source. You can also use an expression to get an URL from the context. Returns the created file. */
  Blob_CreateFromURL: 'Blob.CreateFromURL',
  /** Zip - Creates a zip file from the input file(s). If no file name is given, the first file name in the input will be used. Returns the zip file. */
  Blob_CreateZip: 'Blob.CreateZip',
  /** Export to File - Save the input blob(s) as a file(s) into the given target directory. The blob(s) filename is used as the file name. You can specify an optional <b>prefix</b> string to prepend to the file name. Return back the blob(s). */
  Blob_ExportToFS: 'Blob.ExportToFS',
  /** Get Document File - Gets a file attached to the input document. The file location is specified using an xpath to the blob property of the document. Returns the file. (Alias for Document.GetBlob) */
  Blob_Get: 'Blob.Get',
  /** Get All Document Files - Gets a list of all blobs that are attached on the input document. Returns a list of files. (Alias for Document.GetBlobs) */
  Blob_GetAll: 'Blob.GetAll',
  /** Get Document Files - Gets a list of files that are attached on the input document. The files location should be specified using the blob list property xpath. Returns a list of files. (Alias for Document.GetBlobsByProperty) */
  Blob_GetList: 'Blob.GetList',
  /** Pop File - Restore the last saved input file in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the last <i>pushed</i> file. (Alias for Context.PopBlob) */
  Blob_Pop: 'Blob.Pop',
  /** Pop File List - Restore the last saved input file list in the context input stack (Alias for Context.PopBlobList) */
  Blob_PopList: 'Blob.PopList',
  /** HTTP Post - Post the input file to a target HTTP URL. Returns back the input file. (Alias for Blob.PostToURL) */
  Blob_Post: 'Blob.Post',
  /** HTTP Post - Post the input file to a target HTTP URL. Returns back the input file. */
  Blob_PostToURL: 'Blob.PostToURL',
  /** Pull File - Restore the last saved input file in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the first <i>pushed</i> file. (Alias for Context.PullBlob) */
  Blob_Pull: 'Blob.Pull',
  /** Pull File List - Restore the first saved input file list in the context input stack (Alias for Context.PullBlobList) */
  Blob_PullList: 'Blob.PullList',
  /** Push File - Push the input file on the context stack. The file can be restored later as the input using the corrresponding pop operation. Returns the input file. (Alias for Context.PushBlob) */
  Blob_Push: 'Blob.Push',
  /** Push File List - Push the input file list on the context stack. The file list can be restored later as the input using the corrresponding pop operation. Returns the input file list. (Alias for Context.PushBlobList) */
  Blob_PushList: 'Blob.PushList',
  /** Read Metadata From Binary - Read Metadata From Binary with the default Nuxeo processor. */
  Blob_ReadMetadata: 'Blob.ReadMetadata',
  /** Remove File - Remove the file attached to the input document as specified by the 'xpath' parameter. If the 'xpath' point to a blob list then the list will be cleared. If the file to remove is part of a list it will be removed from the list otherwise the 'xpath' should point to a blob property that will be removed. If the save parameter is set the document modification will be automatically saved. Return the document. (Alias for Blob.RemoveFromDocument) */
  Blob_Remove: 'Blob.Remove',
  /** Remove File - Remove the file attached to the input document as specified by the 'xpath' parameter. If the 'xpath' point to a blob list then the list will be cleared. If the file to remove is part of a list it will be removed from the list otherwise the 'xpath' should point to a blob property that will be removed. If the save parameter is set the document modification will be automatically saved. Return the document. */
  Blob_RemoveFromDocument: 'Blob.RemoveFromDocument',
  /** Blob.RunConverter - Simply call a converter based on the 'converter' parameter. You can pass the converter properties with the 'properties' parameter. */
  Blob_RunConverter: 'Blob.RunConverter',
  /** Set File - Set the input file to the given property on the input document. If the xpath points to a blob list then the blob is appended to the list, otherwise the xpath should point to a blob property. If the save parameter is set the document modification will be automatically saved. Return the document. (Alias for Document.SetBlob) */
  Blob_Set: 'Blob.Set',
  /** Set File Name - Modify the filename of a file stored in the input document. The file is found in the input document given its xpath specified through the 'xpath' parameter. Return back the input document. (Alias for Document.SetBlobName) */
  Blob_SetFilename: 'Blob.SetFilename',
  /** Write Metadata To Blob From Context - Write Metadata To Blob From Context given a processor name (or the default Nuxeo one) and given metadata, and return the updated Blob. */
  Blob_SetMetadataFromContext: 'Blob.SetMetadataFromContext',
  /** Write Metadata To Binary From Document - Write metadata to a Blob (xpath parameter, or BlobHolder if empty) from a document (input) given a custom metadata mapping defined in a Properties parameter, using a named processor (exifTool for instance). */
  Blob_SetMetadataFromDocument: 'Blob.SetMetadataFromDocument',
  /** Export to File - Save the input blob(s) as a file(s) into the given target directory. The blob(s) filename is used as the file name. You can specify an optional <b>prefix</b> string to prepend to the file name. Return back the blob(s). (Alias for Blob.ExportToFS) */
  Blob_ToFile: 'Blob.ToFile',
  /** Convert To PDF - Convert the input file to a PDF and return the new file. */
  Blob_ToPDF: 'Blob.ToPDF',
  /** Attach File or files to the currentDocument. - Attach the input file(s) to the current document using the BlobHolder abstraction (Alias for BlobHolder.AttachOnCurrentDocument) */
  BlobHolder_Attach: 'BlobHolder.Attach',
  /** Attach File or files to the currentDocument. - Attach the input file(s) to the current document using the BlobHolder abstraction */
  BlobHolder_AttachOnCurrentDocument: 'BlobHolder.AttachOnCurrentDocument',
  /** blobToPDF */
  blobToPDF: 'blobToPDF',
  /** Run a bulk command - Run a bulk action on a set of documents expressed by a NXQL. */
  Bulk_RunAction: 'Bulk.RunAction',
  /** Wait for Bulk computation - Wait until Bulk computation is done. This operation is meant to be used for tests. Its usage in production is not recommended. */
  Bulk_WaitForAction: 'Bulk.WaitForAction',
  /** Bulk Restart Workflow - Bulk operation to restart workflows. (Alias for WorkflowModel.BulkRestartInstances) */
  BulkRestartWorkflow: 'BulkRestartWorkflow',
  /** BusinessCreateOperation - This operation map pojo client side to document adapter server side and create NX document assuming that pojo and adapter have both properties in common. */
  Business_BusinessCreateOperation: 'Business.BusinessCreateOperation',
  /** BusinessFetchOperation - This operation map pojo client side to document adapter server side and fetch the related NX document. */
  Business_BusinessFetchOperation: 'Business.BusinessFetchOperation',
  /** BusinessUpdateOperation - This operation map pojo client side to document adapter server side and update the related NX document. */
  Business_BusinessUpdateOperation: 'Business.BusinessUpdateOperation',
  /** cancelWorkflow */
  cancelWorkflow: 'cancelWorkflow',
  /** Add document to collection - Add a list of documents in a collection. No value is returned. (Alias for Document.AddToCollection) */
  Collection_AddToCollection: 'Collection.AddToCollection',
  /** Add document to favorites - Add a list of documents in the favorites. No value is returned. (Alias for Document.AddToFavorites) */
  Collection_AddToFavorites: 'Collection.AddToFavorites',
  /** Create a collection - Create a new collection. This is returning the document serialization of the created collection. */
  Collection_Create: 'Collection.Create',
  /** Create a collection - Create a new collection. This is returning the document serialization of the created collection. (Alias for Collection.Create) */
  Collection_CreateCollection: 'Collection.CreateCollection',
  /** Get collections - Get the list of all the collections visible by the currentUser. This is returning a list of collections. (Alias for User.GetCollections) */
  Collection_GetCollections: 'Collection.GetCollections',
  /** Get documents from collection - Get the list of documents visible by the currentUser in a collection. This is returning a list of documents. */
  Collection_GetDocumentsFromCollection: 'Collection.GetDocumentsFromCollection',
  /** Get documents from favorites - Get the list of documents visible from the currentUser's favorites. This is returning a list of documents. (Alias for Favorite.GetDocuments) */
  Collection_GetElementsInFavorite: 'Collection.GetElementsInFavorite',
  /** Remove from collection - Remove a list of documents from a collection. No value is returned. */
  Collection_RemoveFromCollection: 'Collection.RemoveFromCollection',
  /** Remove from favorites - Remove a list of documents from the favorites. No value is returned. (Alias for Document.RemoveFromFavorites) */
  Collection_RemoveFromFavorites: 'Collection.RemoveFromFavorites',
  /** Get collection suggestion - Get the collection list accessible by the current user. This is returning a blob containing a serialized JSON array.. */
  Collection_Suggestion: 'Collection.Suggestion',
  /** Follow publish or reject transition - Follow publish if accept is true, reject otherwise. */
  Comment_Moderate: 'Comment.Moderate',
  /** containerContentBlob */
  containerContentBlob: 'containerContentBlob',
  /** Apply mapping on input task doc - Applies the mapping passed in parameter on the task document. The sourceDoc in the mapping is the input document in the workflow. The operation throws a NuxeoException if the input document is not a Task. (Alias for Task.ApplyDocumentMapping) */
  Context_ApplyMappingOnTask: 'Context.ApplyMappingOnTask',
  /** Cancel workflow - Cancel the workflow with the given id, where the required id is the id of the document representing the workflow instance. (Alias for WorkflowInstance.Cancel) */
  Context_CancelWorkflow: 'Context.CancelWorkflow',
  /** Context Document(s) - Fetch the input of the context as a document or list of documents. The document will become the input for the next operation. */
  Context_FetchDocument: 'Context.FetchDocument',
  /** Context File(s) - Fetch the input of the context as a file or list of files. The file(s) will become the input for the next operation. */
  Context_FetchFile: 'Context.FetchFile',
  /** Get Principal Emails - Fetch the principal emails that have a given permission on the input document and then set them in the context under the given key variable name. The operation returns the input document. You can later use the list of principals set by this operation on the context from another operation. The 'key' argument represents the variable name and the 'permission' argument the permission to check. If the 'ignore groups' argument is false then groups are recursively resolved, extracting user members of these groups. Be <b>warned</b> that this may be a very consuming operation.<ul>Note that <li></li><li>groups are not included</li><li>the list pushed into the context is a string list of emails.</li></ul> */
  Context_GetEmailsWithPermissionOnDoc: 'Context.GetEmailsWithPermissionOnDoc',
  /** Get open tasks - Returns all open tasks for the input document(s). If the operation is invoked with parameters, all tasks instances for the given 'processId' originating from the given 'nodeId' are returned. The 'processId' is the id of the document representing the workflow instance. The parameter 'username' is used to fetch only tasks assigned to the given user. Tasks are queried using an unrestricted session. (Alias for Workflow.GetOpenTasks) */
  Context_GetOpenTasks: 'Context.GetOpenTasks',
  /** Get Task Translated Names - Returns a list of current user open tasks where their translated name matches (partially or fully ) the 'searchTerm' parameter. This operation is invoked from a select2widget and the number of returned results is limited to 15. */
  Context_GetTaskNames: 'Context.GetTaskNames',
  /** Get Users and Groups - Fetch the users and groups that have a given permission on the input document and then set them in the context under the given key variable name. The operation returns the input document. You can later use the list of identifiers set by this operation on the context from another operation. The 'key' argument represents the variable name and the 'permission' argument the permission to check. If the 'ignore groups' argument is false then groups will be part of the result. If the 'resolve groups' argument is true then groups are recursively resolved, adding user members of these groups in place of them. Be <b>warned</b> that this may be a very consuming operation. If the 'prefix identifiers' argument is true, then user identifiers are prefixed by 'user:' and groups identifiers are prefixed by 'group:'. */
  Context_GetUsersGroupIdsWithPermissionOnDoc: 'Context.GetUsersGroupIdsWithPermissionOnDoc',
  /** Pop File - Restore the last saved input file in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the last <i>pushed</i> file. */
  Context_PopBlob: 'Context.PopBlob',
  /** Pop File List - Restore the last saved input file list in the context input stack */
  Context_PopBlobList: 'Context.PopBlobList',
  /** Pop Document - Restore the last saved input document in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the last <i>pushed</i> document. */
  Context_PopDocument: 'Context.PopDocument',
  /** Pop Document List - Restore the last saved input document list in the context input stack */
  Context_PopDocumentList: 'Context.PopDocumentList',
  /** Pull File - Restore the last saved input file in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the first <i>pushed</i> file. */
  Context_PullBlob: 'Context.PullBlob',
  /** Pull File List - Restore the first saved input file list in the context input stack */
  Context_PullBlobList: 'Context.PullBlobList',
  /** Pull Document - Restore the first saved input document in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the first <i>pushed</i> document. */
  Context_PullDocument: 'Context.PullDocument',
  /** Pull Document List - Restore the first saved input document list in the context input stack */
  Context_PullDocumentList: 'Context.PullDocumentList',
  /** Push File - Push the input file on the context stack. The file can be restored later as the input using the corrresponding pop operation. Returns the input file. */
  Context_PushBlob: 'Context.PushBlob',
  /** Push File List - Push the input file list on the context stack. The file list can be restored later as the input using the corrresponding pop operation. Returns the input file list. */
  Context_PushBlobList: 'Context.PushBlobList',
  /** Push Document - Push the input document on the context stack. The document can be restored later as the input using the corrresponding pop operation. Returns the input document. */
  Context_PushDocument: 'Context.PushDocument',
  /** Push Document List - Push the input document list on the context stack. The document list can be restored later as the input using the corrresponding pop operation. Returns the input document list. */
  Context_PushDocumentList: 'Context.PushDocumentList',
  /** Read Metadata From Binary to Context - Read Metadata From binary to Context for a given input blob and given metadata to inject into the Operation context (if not specified, all metadata will be injected)  (Alias for Context.SetMetadataFromBlob) */
  Context_ReadMetadataFromBinary: 'Context.ReadMetadataFromBinary',
  /** Restore File Input - Restore the file input from a context variable given its name. Return the file. */
  Context_RestoreBlobInput: 'Context.RestoreBlobInput',
  /** Restore input blob from a script - Run a script and return the result blob object of the script the output of the operation */
  Context_RestoreBlobInputFromScript: 'Context.RestoreBlobInputFromScript',
  /** Restore Files Input - Restore the file list input from a context variable given its name. Return the files. */
  Context_RestoreBlobsInput: 'Context.RestoreBlobsInput',
  /** Restore input blobs from a script - Run a script and return the result Blobs object of the script the output of the operation */
  Context_RestoreBlobsInputFromScript: 'Context.RestoreBlobsInputFromScript',
  /** Restore Document Input - Restore the document input from a context variable given its name. Return the document. */
  Context_RestoreDocumentInput: 'Context.RestoreDocumentInput',
  /** Restore input document from a script - Run a script and return the result Document object of the script the output of the operation */
  Context_RestoreDocumentInputFromScript: 'Context.RestoreDocumentInputFromScript',
  /** Restore Documents Input - Restore the document list input from a context variable given its name. Return the document list. */
  Context_RestoreDocumentsInput: 'Context.RestoreDocumentsInput',
  /** Restore input documents from a script - Run a script and return the result documents object of the script the output of the operation */
  Context_RestoreDocumentsInputFromScript: 'Context.RestoreDocumentsInputFromScript',
  /** Run Document Chain - Run an operation chain which is returning a document in the current context. The input for the chain ro run is the current input of the operation. Return the output of the chain as a document. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. (Alias for RunDocumentOperation) */
  Context_RunDocumentOperation: 'Context.RunDocumentOperation',
  /** Run Document Chain in new Tx - Run an operation chain in a separate tx. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. */
  Context_RunDocumentOperationInNewTx: 'Context.RunDocumentOperationInNewTx',
  /** Run File Chain - Run an operation chain which is returning a file in the current context. The input for the chain to run is a file or a list of files. Return the output of the chain as a file or a list of files. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. (Alias for RunFileOperation) */
  Context_RunFileOperation: 'Context.RunFileOperation',
  /** Run Input Script - Run a script from the input blob. A blob comtaining script result is returned. (Alias for RunInputScript) */
  Context_RunInputScript: 'Context.RunInputScript',
  /** Run Chain - Run an operation chain in the current context. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. (Alias for RunOperation) */
  Context_RunOperation: 'Context.RunOperation',
  /** Run For Each - Run an operation for each element from the list defined by the 'list' parameter. The 'list' parameter is pointing to a context variable that represents the list which will be iterated. The 'item' parameter represents the name of the context variable which will point to the current element in the list at each iteration. You can use the 'isolate' parameter to specify whether or not the evalution context is the same as the parent context or a copy of it. If the 'isolate' parameter is 'true' then a copy of the current context is used and so that modifications in this context will not affect the parent context. Any input is accepted. The input is returned back as output when operation terminates. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. (Alias for RunOperationOnList) */
  Context_RunOperationOnList: 'Context.RunOperationOnList',
  /** Run For Each Page - Run an operation for each page of the provider defined by the provider name, the operation input is the curent page  (Alias for RunOperationOnProvider) */
  Context_RunOperationOnProvider: 'Context.RunOperationOnProvider',
  /** Run Script - Run a script which content is specified as text in the 'script' parameter (Alias for RunScript) */
  Context_RunScript: 'Context.RunScript',
  /** Set Context Variable From Input - Set a context variable that points to the current input object. You must give a name for the variable. This operation works on any input type and return back the input as the output. */
  Context_SetInputAsVar: 'Context.SetInputAsVar',
  /** Read Metadata From Binary to Context - Read Metadata From binary to Context for a given input blob and given metadata to inject into the Operation context (if not specified, all metadata will be injected)  */
  Context_SetMetadataFromBlob: 'Context.SetMetadataFromBlob',
  /** Set Context Variable - Set a context variable given a name and the value. To compute the value at runtime from the current context you should use an EL expression as the value. This operation works on any input type and return back the input as the output. */
  Context_SetVar: 'Context.SetVar',
  /** Set Node Variable - Set a workflow node variable given a name and the value in the context of a running workflow. To compute the value at runtime from the current context you should use an EL expression as the value. This operation works on any input type and return back the input as the output. (Alias for Workflow.SetNodeVariable) */
  Context_SetWorkflowNodeVar: 'Context.SetWorkflowNodeVar',
  /** Set Workflow Variable - Set a workflow variable. The workflow variable must exists on the workflow. If no workflowId is specified the variable is set on the current workflow.To compute the value at runtime from the current context you should use a MVEL expression as the value. This operation works on any input type and return back the input as the output. */
  Context_SetWorkflowVar: 'Context.SetWorkflowVar',
  /** Start workflow - Starts the workflow with the given model id on the input documents. Returns back the input documents.The id of the created workflow instance is available under the "workflowInstanceId" context variable.@Since 5.7.2 you can set multiple variables on the workflow (before 5.8 only scalar types are supported). The variables are specified as <i>key=value</i> pairs separated by a new line.To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>title=The Document Title<br>issued=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p> @since 5.9.3 and 5.8.0-HF10 you can also set variables of complex types, by submiting a JSON representation: <p><pre>assignees = ["John Doe", "John Test"]</pre></p> */
  Context_StartWorkflow: 'Context.StartWorkflow',
  /** Retrieve counters values - Retrieve data collected by one or more Counters */
  Counters_GET: 'Counters.GET',
  /** Create Proxy Live - This operation will create a proxy that points the given document as input. This is like a symbolic link for File System. The proxy will be created into the destination specified as parameter. <p>The document returned is the proxy live.<p> Remark: <b>you will have a strange behavior if the input is a folderish.</b> (Alias for Document.CreateLiveProxy) */
  CreateProxyLive: 'CreateProxyLive',
  /** Creates directory entries - Creates directory entries. Entries are sent as a JSON array. Returning the created entries ids as a JSON array. */
  Directory_CreateEntries: 'Directory.CreateEntries',
  /** Vocabulary: Add Entry - Add a new entry in the <i>vocabularyName</i> vocabulary only if <i>id</i> is not found (an existing entry isnot updated). If <i>label</i> is empty, it is set to the id. WARNING: Current user must have enough rights to write in a vocabulary. */
  Directory_CreateVocabularyEntry: 'Directory.CreateVocabularyEntry',
  /** Deletes directory entries - Deletes directory entries. Entries ids to delete are sent through a JSON array. Returns deleted entries id as a JSON array. */
  Directory_DeleteEntries: 'Directory.DeleteEntries',
  /** Get directory entries - Get the entries of a directory. This is returning a blob containing a serialized JSON array. The input document, if specified, is used as a context for a potential local configuration of the directory. */
  Directory_Entries: 'Directory.Entries',
  /** Load directory entries from CSV file - Load directory entries from a CSV file. Depending on the data loading policy, duplicate entries are ignored, updated or trigger an error. */
  Directory_LoadFromCSV: 'Directory.LoadFromCSV',
  /** Get a Directory Projection - Executes a query using given filter and return only the column *<b>columnName</b>*. The result is assigned to the context variable *<b>variableName</b>*. The filters are specified as <i>key=value</i> pairs separated by a new line. The key used for a filter is the column name of the directory. To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>firstName=John<br>lastName=doe</pre>By default, the search filters use exact match. You can do a fulltext search on some specific columns using the fulltextFields. it's specified as comma separated columnName, for instance : <p>Example:<pre>firstName,lastName</pre> */
  Directory_Projection: 'Directory.Projection',
  /** Reads directory entries - Reads directory entries. Entries ids to read are sent as a JSON array. Returns the entries as a JSON array of JSON objects containing all fields. */
  Directory_ReadEntries: 'Directory.ReadEntries',
  /** Get suggested directory entries - Get the entries suggestions of a directory. This is returning a blob containing a serialized JSON array. Prefix parameter is used to filter the entries. */
  Directory_SuggestEntries: 'Directory.SuggestEntries',
  /** Updates directory entries - Updates directory entries. Entries to update are sent as a JSON array. Returns the updated entries ids as a JSON array of JSON objects containing all fields */
  Directory_UpdateEntries: 'Directory.UpdateEntries',
  /** Set ACL - Set Acces Control Entry on the input document(s). Returns the document(s). */
  Document_AddACE: 'Document.AddACE',
  /** Add Permission - Add Permission on the input document(s). Returns the document(s). (Alias for Document.AddPermission) */
  Document_AddACL: 'Document.AddACL',
  /** Add entry into multi-valued metadata - Add value into the field expressed by the xpath parameter. This field must be a multivalued metadata.<p> 'checkExists' parameter enables to add value only if doesn't already exists in the field: <ul><li> if checked, the value will not be added if it exists already in the list</li><li>if not checked the value will be always added</li</ul>.<p> Remark: <b>only works for a field that stores a list of scalars (string, boolean, date, int, long) and not list of complex types.</b></p><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> */
  Document_AddEntryToMultivaluedProperty: 'Document.AddEntryToMultivaluedProperty',
  /** Add Facet - Adds the facet to the document. <p>WARNING: The save parameter is true by default, which means the document is saved in the database after adding the facet. It must be set to false when the operation is used in the context of an event that will fail if the document is saved (empty document created, about to create, before modification, ...).</p> */
  Document_AddFacet: 'Document.AddFacet',
  /** Adds an Entry Into a Multivalued Complex Property - This operation can add new entries to a multivalued complex property. The xpath parameter is the property that should be updated (e.g.: contract:customers). The value parameter is a String containing the JSON-formatted list of entries to add. E.g.: assuming a Contract document type holding customers, each having a firstName and lastName property: [{"lastName":"Norris", "firstName": "Chuck"}, {"lastName":"Lee", "firstName": "Bruce"}] . Activating the save parameter forces the changes to be written in database immediately (at the cost of performance loss), otherwise changes made to the document will be written in bulk when the chain succeeds. <p>Save parameter has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> */
  Document_AddItemToListProperty: 'Document.AddItemToListProperty',
  /** Add Permission - Add Permission on the input document(s). Returns the document(s). */
  Document_AddPermission: 'Document.AddPermission',
  /** Create Relation - Create a relation between 2 documents. The subject of the relation will be the input of the operation and the object of the relation will be retrieved from the context using the 'object' field. The 'predicate' field specifies the relation predicate (When using a known predicate, use the full URL like 'http://purl.org/dc/terms/IsBasedOn', unknown predicates will be treated as plain strings and be the same on the subject and object). The 'outgoing' flag indicates the direction of the relation - the default is false which means the relation will go from the input object to the object specified as 'object' parameter. Return back the subject document. */
  Document_AddRelation: 'Document.AddRelation',
  /** Add document to collection - Add a list of documents in a collection. No value is returned. */
  Document_AddToCollection: 'Document.AddToCollection',
  /** Add document to favorites - Add a list of documents in the favorites. No value is returned. */
  Document_AddToFavorites: 'Document.AddToFavorites',
  /** Block Permission Inheritance - Block the permission inheritance on the input document(s). Returns the document(s). */
  Document_BlockPermissionInheritance: 'Document.BlockPermissionInheritance',
  /** Check In - Checks in the input document. Returns back the document. */
  Document_CheckIn: 'Document.CheckIn',
  /** Check Out - Checks out the input document. Returns back the document. */
  Document_CheckOut: 'Document.CheckOut',
  /** Copy - Copy the input document into the given Folderish. The name parameter will be used as the copy name otherwise if not specified the original name will be preserved. The target Folderish can be specified as an absolute or relative path (relative to the input document) as an UID or by using an EL expression. Return the newly created document (the copy). The document is copied with its children recursively. The resetLifeCycle parameter allows to reset the life cycle of the copied document. */
  Document_Copy: 'Document.Copy',
  /** Copy Schema - Copy all the properties from the schema of the source into the input document. Either sourceId or sourcePath parameter should be filled. When both are filled, sourceId will be used. If saveDocument is true, the document is saved. If save is true, the session is saved (setting save to true and saveDocument to false has no effect, the session will not be saved) */
  Document_CopySchema: 'Document.CopySchema',
  /** Create - Create a new document in the input folder. You can initialize the document properties using the 'properties' parameter. The properties are specified as <i>key=value</i> pairs separated by a new line. The key used for a property is the property xpath. To specify multi-line values, you can use a \ character followed by a new line. <p>Example:<pre>dc:title=The Document Title<br>dc:description=foo bar</pre>. Returns the created document. */
  Document_Create: 'Document.Create',
  /** Create Proxy Live - This operation will create a proxy that points the given document as input. This is like a symbolic link for File System. The proxy will be created into the destination specified as parameter. <p>The document returned is the proxy live.<p> Remark: <b>you will have a strange behavior if the input is a folderish.</b> */
  Document_CreateLiveProxy: 'Document.CreateLiveProxy',
  /** Snapshot Version - Create a new version for the input document. Any modification made on the document by the chain will be automatically saved. Increment version if this was specified through the 'snapshot' parameter. This operation should not be used in the context of the empty document created, about to create, before document modification, document modified events. Returns the live document (not the version). */
  Document_CreateVersion: 'Document.CreateVersion',
  /** Delete - Delete the input document. The previous context input will be restored for the next operation. */
  Document_Delete: 'Document.Delete',
  /** Delete Relation - Delete a relation between 2 documents. The subject of the relation will be the input of the operation and the object of the relation will be retrieved from the context using the 'object' field. The 'predicate' field specifies the relation predicate (When using a known predicate, use the full URL like 'purl.org/dc/terms/IsBasedOn', unknown predicates will be treated as plain strings and be the same on the subject and object). The 'outgoing' flag indicates the direction of the relation - the default is false which means the relation will go from the input object to the object specified as 'object' parameter. Return back the subject document. */
  Document_DeleteRelation: 'Document.DeleteRelation',
  /** Empty Trash - Emtpy a folder's trash by permanently deleting documents marked as trashed. */
  Document_EmptyTrash: 'Document.EmptyTrash',
  /** Document Export - Export the given document. */
  Document_Export: 'Document.Export',
  /** Document - Fetch a document from the repository given its reference (path or UID). The document will become the input of the next operation. (Alias for Repository.GetDocument) */
  Document_Fetch: 'Document.Fetch',
  /** Fetch By Property - For each specified string property value, fetch all documents that match the property and the optional where clause. Matching documents are collected into a list and the returned to the next operation. The operation has no input. */
  Document_FetchByProperty: 'Document.FetchByProperty',
  /** Filter List - Filter the input list of documents given a condition. The condition can be expressed using 4 parameters: types, facets, lifecycle and condition. If more than one parameter is specified an AND will be used to group conditions. <br>The 'types' parameter can take a comma separated list of document type: File,Note.<br>The 'facet' parameter can take a single facet name.<br> The 'life cycle' parameter takes a name of a life cycle state the document should have.<br>The 'condition' parameter can take any EL expression.<p>Returns the list of documents that match the filter condition. */
  Document_Filter: 'Document.Filter',
  /** Follow Life Cycle Transition - Follow the given transition on the input document life cycle state */
  Document_FollowLifecycleTransition: 'Document.FollowLifecycleTransition',
  /** Get Document File - Gets a file attached to the input document. The file location is specified using an xpath to the blob property of the document. Returns the file. */
  Document_GetBlob: 'Document.GetBlob',
  /** Get All Document Files - Gets a list of all blobs that are attached on the input document. Returns a list of files. */
  Document_GetBlobs: 'Document.GetBlobs',
  /** Get Document Files - Gets a list of files that are attached on the input document. The files location should be specified using the blob list property xpath. Returns a list of files. */
  Document_GetBlobsByProperty: 'Document.GetBlobsByProperty',
  /** Get Child - Get a child document given its name. Take as input the parent document and return the child document. */
  Document_GetChild: 'Document.GetChild',
  /** Get Children - Get the children of a document. The list of children will become the input for the next operation */
  Document_GetChildren: 'Document.GetChildren',
  /** Gets the folder's children or the collection's members default renditions - Gets the list of blob of the folder's children or the collection's members default renditions. Returns a blob list file containing all the default rendition blobs. */
  Document_GetContainerRendition: 'Document.GetContainerRendition',
  /** Get Last version - Returns the last version of the document if it exists. */
  Document_GetLastVersion: 'Document.GetLastVersion',
  /** Get Linked Documents - Get the relations for the input document. The 'outgoing' parameter ca be used to specify whether outgoing or incoming relations should be returned. Retuns a document list. */
  Document_GetLinkedDocuments: 'Document.GetLinkedDocuments',
  /** Get Parent - Get the parent document of the input document. The parent document will become the input for the next operation. You can use the 'type' parameter to specify which parent to select from the document ancestors */
  Document_GetParent: 'Document.GetParent',
  /** Get Principal Emails - Fetch the principal emails that have a given permission on the input document and then set them in the context under the given key variable name. The operation returns the input document. You can later use the list of principals set by this operation on the context from another operation. The 'key' argument represents the variable name and the 'permission' argument the permission to check. If the 'ignore groups' argument is false then groups are recursively resolved, extracting user members of these groups. Be <b>warned</b> that this may be a very consuming operation.<ul>Note that <li></li><li>groups are not included</li><li>the list pushed into the context is a string list of emails.</li></ul> (Alias for Context.GetEmailsWithPermissionOnDoc) */
  Document_GetPrincipalEmails: 'Document.GetPrincipalEmails',
  /** Gets a document rendition - Gets a document rendition given its name. Returns the rendition blob. */
  Document_GetRendition: 'Document.GetRendition',
  /** Get Users and Groups - Fetch the users and groups that have a given permission on the input document and then set them in the context under the given key variable name. The operation returns the input document. You can later use the list of identifiers set by this operation on the context from another operation. The 'key' argument represents the variable name and the 'permission' argument the permission to check. If the 'ignore groups' argument is false then groups will be part of the result. If the 'resolve groups' argument is true then groups are recursively resolved, adding user members of these groups in place of them. Be <b>warned</b> that this may be a very consuming operation. If the 'prefix identifiers' argument is true, then user identifiers are prefixed by 'user:' and groups identifiers are prefixed by 'group:'. (Alias for Context.GetUsersGroupIdsWithPermissionOnDoc) */
  Document_GetUsersAndGroups: 'Document.GetUsersAndGroups',
  /** Get Versions - Gets the versions of the input document. */
  Document_GetVersions: 'Document.GetVersions',
  /** Lock - Lock the input document for the current user. Returns back the locked document. */
  Document_Lock: 'Document.Lock',
  /** Send E-Mail - Send an email using the input document to the specified recipients. You can use the HTML parameter to specify whether you message is in HTML format or in plain text. Also you can attach any blob on the current document to the message by using the comma separated list of xpath expressions 'files'. If you xpath points to a blob list all blobs in the list will be attached. Return back the input document(s). If rollbackOnError is true, the whole chain will be rollbacked if an error occurs while trying to send the email (for instance if no SMTP server is configured), else a simple warning will be logged and the chain will continue. */
  Document_Mail: 'Document.Mail',
  /** Move - Move the input document into the target folder. */
  Document_Move: 'Document.Move',
  /** Reorder members of a collection - Move member1 of a collection right after member2 of the same collection. If member2 is not sepcified, the member1 is moved to first position. Returns true if successfully moved. */
  Document_MoveCollectionMember: 'Document.MoveCollectionMember',
  /** Multi-Publish - Publish the input document(s) into several target sections. The target is evaluated to a document list (can be a path, UID or EL expression). Existing proxy is overridden if the override attribute is set. Returns a list with the created proxies. (Alias for Document.PublishToSections) */
  Document_MultiPublish: 'Document.MultiPublish',
  /** Order Document - Given a parent document, order the source child before the destination child. */
  Document_Order: 'Document.Order',
  /** PageProvider - Perform a named provider query on the repository. Result is paginated. The query result will become the input for the next operation. (Alias for Repository.PageProvider) */
  Document_PageProvider: 'Document.PageProvider',
  /** Pop Document - Restore the last saved input document in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the last <i>pushed</i> document. (Alias for Context.PopDocument) */
  Document_Pop: 'Document.Pop',
  /** Pop Document List - Restore the last saved input document list in the context input stack (Alias for Context.PopDocumentList) */
  Document_PopList: 'Document.PopList',
  /** Publish Document's Rendition - input document's chosen rendition into the target section. If rendition is not given and default rendition option is false, it falls back on default publishing. Existing proxy is overrided if the override attribute is set. Return the created proxy. (Alias for Document.PublishToSection) */
  Document_Publish: 'Document.Publish',
  /** Publish Document's Rendition - input document's chosen rendition into the target section. If rendition is not given and default rendition option is false, it falls back on default publishing. Existing proxy is overrided if the override attribute is set. Return the created proxy. (Alias for Document.PublishToSection) */
  Document_PublishRendition: 'Document.PublishRendition',
  /** Publish Document's Rendition - input document's chosen rendition into the target section. If rendition is not given and default rendition option is false, it falls back on default publishing. Existing proxy is overrided if the override attribute is set. Return the created proxy. */
  Document_PublishToSection: 'Document.PublishToSection',
  /** Multi-Publish - Publish the input document(s) into several target sections. The target is evaluated to a document list (can be a path, UID or EL expression). Existing proxy is overridden if the override attribute is set. Returns a list with the created proxies. */
  Document_PublishToSections: 'Document.PublishToSections',
  /** Pull Document - Restore the first saved input document in the context input stack. This operation must be used only if a PUSH operation was previously made. Return the first <i>pushed</i> document. (Alias for Context.PullDocument) */
  Document_Pull: 'Document.Pull',
  /** Pull Document List - Restore the first saved input document list in the context input stack (Alias for Context.PullDocumentList) */
  Document_PullList: 'Document.PullList',
  /** Push Document - Push the input document on the context stack. The document can be restored later as the input using the corrresponding pop operation. Returns the input document. (Alias for Context.PushDocument) */
  Document_Push: 'Document.Push',
  /** Push Document List - Push the input document list on the context stack. The document list can be restored later as the input using the corrresponding pop operation. Returns the input document list. (Alias for Context.PushDocumentList) */
  Document_PushList: 'Document.PushList',
  /** Query - Perform a query on the repository. The document list returned will become the input for the next operation.If no provider name is given, a query returning all the documents that the user has access to will be executed. (Alias for Repository.Query) */
  Document_Query: 'Document.Query',
  /** Reset - Reload the input document from the repository. Any previous modification made by the chain on this document will be lost if these modifications were not saved. Return the reloaded document. */
  Document_Reload: 'Document.Reload',
  /** Remove ACL - Remove a named Acces Control List from the input document(s). Returns the document(s). */
  Document_RemoveACL: 'Document.RemoveACL',
  /** Remove Entry Of Multivalued Property - Remove the first entry of the giving value in the multivalued xpath, does nothing if does not exist: <ul<li>if 'is Remove All' is check, all entry instance in the list.</li><li>if not will remove just the first one found</li></ul><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> */
  Document_RemoveEntryOfMultivaluedProperty: 'Document.RemoveEntryOfMultivaluedProperty',
  /** Remove Facet - Removes the facet from the document. <p>WARNING: The save parameter is true by default, which means the document is saved in the database after removing the facet. It must be set to false when the operation is used in the context of an event that will fail if the document is saved (empty document created, about to create, before modification, ...).</p> */
  Document_RemoveFacet: 'Document.RemoveFacet',
  /** Remove from favorites - Remove a list of documents from the favorites. No value is returned. */
  Document_RemoveFromFavorites: 'Document.RemoveFromFavorites',
  /** Removes an Entry From a Multivalued Property - This operation removes an entry from a multivalued property, specified using a xpath (e.g.: contract:customers). A specific entry can be removed using its index number. If the index parameter is left empty, all entries in the property are removed. Activating the save parameter forces the changes to be written in database immediately (at the cost of performance loss), otherwise changes made to the document will be written in bulk when the chain succeeds. <p>Save parameter has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> */
  Document_RemoveItemFromListProperty: 'Document.RemoveItemFromListProperty',
  /** Remove Permission - Remove a permission given its id or all permissions for a given user on the input document(s). Parameter 'id' or 'user' must be set. Returns the document(s). */
  Document_RemovePermission: 'Document.RemovePermission',
  /** Remove Property - Remove the given property of the input document(s) as specified by the 'xpath' parameter. If the property points to a list then clear the list. Removing a property means setting it to null. Return the document(s). */
  Document_RemoveProperty: 'Document.RemoveProperty',
  /** Remove Document Proxies - Will remove all proxies pointing on the input document. Useful for instance to unpublish a document. Notice: this operation will remove all proxies, including the ones pointing to the current document version (live proxies). Activating the save parameter forces the changes to be written in database immediately (at the cost of performance loss). */
  Document_RemoveProxies: 'Document.RemoveProxies',
  /** Replace Permission - Replace a given permission on the input document(s). Returns the document(s). */
  Document_ReplacePermission: 'Document.ReplacePermission',
  /** Reset Schema - Reset all properties for a given schema or xpath. If saveDocument is true, the document is saved. If save is true, the session is saved (setting save to true and saveDocument to false has no effect, the session will not be saved).<p>WARNING: Default values are true for both saveDocument and save, which means the document is saved by default. saveDocument must be set to false when the operation is used in the context of an event that will fail if the document is saved (empty document created, about to create, before modification, ...).</p> */
  Document_ResetSchema: 'Document.ResetSchema',
  /** Restore Version - Restores a document to the input version document. If createVersion is true, a version of the live document will be created before restoring it to the input version. If checkout is true, a checkout will be processed after restoring the document, visible in the UI by the '+' symbol beside the version number. Returns the restored document. */
  Document_RestoreVersion: 'Document.RestoreVersion',
  /** Get graph - get graph nodes. */
  Document_Routing_GetGraph: 'Document.Routing.GetGraph',
  /** Update comments number on the document */
  Document_Routing_UpdateCommentsInfoOnDocument: 'Document.Routing.UpdateCommentsInfoOnDocument',
  /** Save - Save in the repository any modification that was done on the input document. This operation should not be used in the context of the empty document created, about to create, before document modification, document modified events. Returns the saved document. */
  Document_Save: 'Document.Save',
  /** Save Session - Commit any changes made by the operation on the documents. This can be used to explicitly commit changes. This operation can be executed on any type of input. The input of this operation will be preserved as the input for the next operation in the chain. (Alias for Repository.SaveSession) */
  Document_SaveSession: 'Document.SaveSession',
  /** Send the notification email for a permission - Send the notification email for a permission on the input document(s). Returns the document(s). */
  Document_SendNotificationEmailForPermission: 'Document.SendNotificationEmailForPermission',
  /** Set ACL - Set Acces Control Entry on the input document(s). Returns the document(s). (Alias for Document.AddACE) */
  Document_SetACE: 'Document.SetACE',
  /** Set File - Set the input file to the given property on the input document. If the xpath points to a blob list then the blob is appended to the list, otherwise the xpath should point to a blob property. If the save parameter is set the document modification will be automatically saved. Return the document. */
  Document_SetBlob: 'Document.SetBlob',
  /** Set File Name - Modify the filename of a file stored in the input document. The file is found in the input document given its xpath specified through the 'xpath' parameter. Return back the input document. */
  Document_SetBlobName: 'Document.SetBlobName',
  /** Follow Life Cycle Transition - Follow the given transition on the input document life cycle state (Alias for Document.FollowLifecycleTransition) */
  Document_SetLifeCycle: 'Document.SetLifeCycle',
  /** Trigger Metadata Mapping - Write Metadata To Document From Binary according to metadata mapping. */
  Document_SetMetadataFromBlob: 'Document.SetMetadataFromBlob',
  /** Update Property - Set a single property value on the input document. The property is specified using its xpath. Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events. Returns the modified document. */
  Document_SetProperty: 'Document.SetProperty',
  /** Subscribe document - Subscribe one or more documents. No value is returned. */
  Document_Subscribe: 'Document.Subscribe',
  /** Trash - Moves documents to the trash. */
  Document_Trash: 'Document.Trash',
  /** Trigger Metadata Mapping - Write Metadata To Document From Binary according to metadata mapping. (Alias for Document.SetMetadataFromBlob) */
  Document_TriggerMetadataMapping: 'Document.TriggerMetadataMapping',
  /** Unblock Permission Inheritance - Unblock the permission inheritance on the input document(s). Returns the document(s). */
  Document_UnblockPermissionInheritance: 'Document.UnblockPermissionInheritance',
  /** Unlock - Unlock the input document. The unlock will be executed in the name of the current user. An user can unlock a document only if has the UNLOCK permission granted on the document or if it the same user as the one that locked the document. Return the unlocked document */
  Document_Unlock: 'Document.Unlock',
  /** Unpublish Document's Publications - Unpublish all publications of the input document. Only publications that current user can remove will be unpublished. */
  Document_UnpublishAll: 'Document.UnpublishAll',
  /** Unsubscribe document - Unsubscribe one or more documents. No value is returned. */
  Document_Unsubscribe: 'Document.Unsubscribe',
  /** Untrash - Undeletes documents (and ancestors if needed to make them visible).. */
  Document_Untrash: 'Document.Untrash',
  /** Update Properties - Set multiple properties on the input document. The properties are specified as <i>key=value</i> pairs separated by a new line. The key used for a property is the property xpath. To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>dc:title=The Document Title<br>dc:description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>dc:title=The Document Title<br>dc:issued=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p>Returns back the updated document.<p>To update a multi-valued field with multiple values:<pre>custom:multivalued=a,b,c,d</pre><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> */
  Document_Update: 'Document.Update',
  /** Add entry into multi-valued metadata - Add value into the field expressed by the xpath parameter. This field must be a multivalued metadata.<p> 'checkExists' parameter enables to add value only if doesn't already exists in the field: <ul><li> if checked, the value will not be added if it exists already in the list</li><li>if not checked the value will be always added</li</ul>.<p> Remark: <b>only works for a field that stores a list of scalars (string, boolean, date, int, long) and not list of complex types.</b></p><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> (Alias for Document.AddEntryToMultivaluedProperty) */
  DocumentMultivaluedProperty_addItem: 'DocumentMultivaluedProperty.addItem',
  /** Wait for Indexing - Wait until indexing is done, only for testing purpose. (Alias for Search.WaitForIndexing) */
  Elasticsearch_WaitForIndexing: 'Elasticsearch.WaitForIndexing',
  /** Send Event - Send a Nuxeo event. */
  Event_Fire: 'Event.Fire',
  /** Fetch favorites root collection - Fetch the favorites document root collection. */
  Favorite_Fetch: 'Favorite.Fetch',
  /** Get documents from favorites - Get the list of documents visible from the currentUser's favorites. This is returning a list of documents. */
  Favorite_GetDocuments: 'Favorite.GetDocuments',
  /** Create Folder - Create a Folder using the FileManagerService and set multiple properties on it.<p>The properties are specified as <i>key=value</i> pairs separated by a new line. The key used for a property is the property xpath. To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>dc:title=The Folder Title<br>dc:description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>dc:title=The Folder Title<br>dc:issued=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p>To update a multi-valued field with multiple values:<pre>custom:multivalued=a,b,c,d</pre><p>Returns back the created folder. */
  FileManager_CreateFolder: 'FileManager.CreateFolder',
  /** Create Document from file - Create Document(s) from Blob(s) using the FileManagerService. The destination container must be passed in a Context variable named currentDocument. */
  FileManager_Import: 'FileManager.Import',
  /** FileManager.ImportWithMetaData */
  FileManager_ImportWithMetaData: 'FileManager.ImportWithMetaData',
  /** Create Document from file - Create Document(s) from Blob(s) using the FileManagerService and set multiple properties on them.The destination container must be passed in a Context variable named currentDocument. <p>The properties are specified as <i>key=value</i> pairs separated by a new line. The key used for a property is the property xpath. To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>dc:title=The Document Title<br>dc:description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>dc:title=The Document Title<br>dc:issued=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p>Returns back the updated document.<p>To update a multi-valued field with multiple values:<pre>custom:multivalued=a,b,c,d</pre> */
  FileManager_ImportWithProperties: 'FileManager.ImportWithProperties',
  /** Get Live Document - Get the live document even if this is a Proxy or Version Document. (Alias for Proxy.GetSourceDocument) */
  GetLiveDocument: 'GetLiveDocument',
  /** Create or Update Group */
  Group_CreateOrUpdate: 'Group.CreateOrUpdate',
  /** Image.Blob.ConvertToPDF */
  Image_Blob_ConvertToPDF: 'Image.Blob.ConvertToPDF',
  /** Image.Blob.Resize */
  Image_Blob_Resize: 'Image.Blob.Resize',
  /** initInitiatorComment */
  initInitiatorComment: 'initInitiatorComment',
  /** Json Error Stack Display - Toggle stack display in json response for all rest api calls in Nuxeo */
  JsonStack_ToggleDisplay: 'JsonStack.ToggleDisplay',
  /** Put a Simple Configuration Parameter - Put a Simple Configuration parameter on the input document. Add the 'SimpleConfiguration' facet on the input document if needed. The user adding a parameter must have WRITE access on the input document */
  LocalConfiguration_PutSimpleConfigurationParameter: 'LocalConfiguration.PutSimpleConfigurationParameter',
  /** Put Simple Configuration parameters - Put Simple Configuration parameters on the input document. Add the 'SimpleConfiguration' facet on the input document if needed. The parameters are specified as <i>key=value</i> pairs separated by a new line. The user adding parameters must have WRITE access on the input document. */
  LocalConfiguration_PutSimpleConfigurationParameters: 'LocalConfiguration.PutSimpleConfigurationParameters',
  /** Set Context Variable From a Simple Configuration Parameter - Set a context variable that points to the value of the given parameter name in the SimpleConfiguration from the input Document. You must give a name for the variable. */
  LocalConfiguration_SetSimpleConfigurationParameterAsVar: 'LocalConfiguration.SetSimpleConfigurationParameterAsVar',
  /** Log - Logging with log4j */
  Log: 'Log',
  /** logInAudit */
  logInAudit: 'logInAudit',
  /** Log - Logging with log4j (Alias for Log) */
  LogOperation: 'LogOperation',
  /** mainBlob */
  mainBlob: 'mainBlob',
  /** Metrics - Starts Metrics reporters. */
  Metrics_Start: 'Metrics.Start',
  /** Metrics - Stops Metrics rerporer. */
  Metrics_Stop: 'Metrics.Stop',
  /** nextAssignee */
  nextAssignee: 'nextAssignee',
  /** Send Event - Send a Nuxeo event. (Alias for Event.Fire) */
  Notification_SendEvent: 'Notification.SendEvent',
  /** Send E-Mail - Send an email using the input document to the specified recipients. You can use the HTML parameter to specify whether you message is in HTML format or in plain text. Also you can attach any blob on the current document to the message by using the comma separated list of xpath expressions 'files'. If you xpath points to a blob list all blobs in the list will be attached. Return back the input document(s). If rollbackOnError is true, the whole chain will be rollbacked if an error occurs while trying to send the email (for instance if no SMTP server is configured), else a simple warning will be logged and the chain will continue. (Alias for Document.Mail) */
  Notification_SendMail: 'Notification.SendMail',
  /** notifyInitiatorEndOfWorkflow */
  notifyInitiatorEndOfWorkflow: 'notifyInitiatorEndOfWorkflow',
  /** NRD-AC-PR-ChooseParticipants-Output */
  NRD_AC_PR_ChooseParticipants_Output: 'NRD-AC-PR-ChooseParticipants-Output',
  /** NRD-AC-PR-force-validate */
  NRD_AC_PR_force_validate: 'NRD-AC-PR-force-validate',
  /** NRD-AC-PR-LockDocument */
  NRD_AC_PR_LockDocument: 'NRD-AC-PR-LockDocument',
  /** NRD-AC-PR-storeTaskInfo */
  NRD_AC_PR_storeTaskInfo: 'NRD-AC-PR-storeTaskInfo',
  /** NRD-AC-PR-UnlockDocument */
  NRD_AC_PR_UnlockDocument: 'NRD-AC-PR-UnlockDocument',
  /** NRD-AC-PR-ValidateNode-Output */
  NRD_AC_PR_ValidateNode_Output: 'NRD-AC-PR-ValidateNode-Output',
  /** Nuxeo Drive: Attach blob - Update the given document with the input blob. Return the input blob. */
  NuxeoDrive_AttachBlob: 'NuxeoDrive.AttachBlob',
  /** Nuxeo Drive: Create file - Create a document from the input blob in the container backing the file system item with the given id. Return the file system item backed by the created document as a JSON blob. */
  NuxeoDrive_CreateFile: 'NuxeoDrive.CreateFile',
  /** Nuxeo Drive: Create folder - Create a container with the given name as title in the container backing the file system item with the given id. Return the file system item backed by the created container as a JSON blob. */
  NuxeoDrive_CreateFolder: 'NuxeoDrive.CreateFolder',
  /** Nuxeo Drive: Create test documents */
  NuxeoDrive_CreateTestDocuments: 'NuxeoDrive.CreateTestDocuments',
  /** Nuxeo Drive: Delete - Delete the document backing the file system item with the given id. */
  NuxeoDrive_Delete: 'NuxeoDrive.Delete',
  /** Nuxeo Drive: File system item exists - Check if the document backing the file system item with the given id exists. Return the result as a JSON blob. */
  NuxeoDrive_FileSystemItemExists: 'NuxeoDrive.FileSystemItemExists',
  /** Nuxeo Drive: Get change summary - Get a summary of document changes in the synchronization roots of the currently authenticated user. Return the result as a JSON blob. */
  NuxeoDrive_GetChangeSummary: 'NuxeoDrive.GetChangeSummary',
  /** Nuxeo Drive: Get children - Get the children of the document backing the folder item with the given id. Return the results as a JSON blob. */
  NuxeoDrive_GetChildren: 'NuxeoDrive.GetChildren',
  /** Nuxeo Drive: Get file system item - Get the file system item with the given id. Return the result as a JSON blob. */
  NuxeoDrive_GetFileSystemItem: 'NuxeoDrive.GetFileSystemItem',
  /** Nuxeo Drive: Get Roots - Get the list of synchronization roots for the currently authenticated user. */
  NuxeoDrive_GetRoots: 'NuxeoDrive.GetRoots',
  /** Nuxeo Drive: Get the top level folder - Get the top level folder item. Return the result as a JSON blob. */
  NuxeoDrive_GetTopLevelFolder: 'NuxeoDrive.GetTopLevelFolder',
  /** Nuxeo Drive: Move - Move the document backing the file system item with the given source id to the document backing the file system item with the given destination id. Return the moved file system item as a JSON blob. */
  NuxeoDrive_Move: 'NuxeoDrive.Move',
  /** Nuxeo Drive: Rename - Rename the document backing the file system item with the given id to the given name. Return the file system item backed by the renamed document as a JSON blob. */
  NuxeoDrive_Rename: 'NuxeoDrive.Rename',
  /** Nuxeo Drive: Scroll descendants - Retrieve at most batchSize descendants of the folder item with the given id and the given scrollId. When passing a null scrollId the initial search request is executed and the first batch of results is returned along with a scrollId which should be passed to the next call in order to retrieve the next batch of results. Ideally, the search context made available by the initial search request is kept alive during keepAlive milliseconds if keepAlive is positive. Results are not necessarily sorted. Return the results as a JSON blob. */
  NuxeoDrive_ScrollDescendants: 'NuxeoDrive.ScrollDescendants',
  /** Nuxeo Drive: Activate or deactivate file system item factories */
  NuxeoDrive_SetActiveFactories: 'NuxeoDrive.SetActiveFactories',
  /** Nuxeo Drive: Register / Unregister Synchronization Root - If the enable parameter is true, register the input document as a synchronization root for the currently authenticated user. Unregister it otherwise. */
  NuxeoDrive_SetSynchronization: 'NuxeoDrive.SetSynchronization',
  /** Nuxeo Drive: Setup integration tests */
  NuxeoDrive_SetupIntegrationTests: 'NuxeoDrive.SetupIntegrationTests',
  /** Nuxeo Drive: Tear down integration tests */
  NuxeoDrive_TearDownIntegrationTests: 'NuxeoDrive.TearDownIntegrationTests',
  /** Nuxeo Drive: Update file - Update the document backing the file system item with the given id with the input blob. Return the file system item backed by the updated document as a JSON blob. */
  NuxeoDrive_UpdateFile: 'NuxeoDrive.UpdateFile',
  /** Get Nuxeo Principal - Retrieve Nuxeo principal and export it as a DocumentModel, if login parameter is not set the Operation will return informations about the current user, otherwise Directory Administration rights are required. (Alias for User.Get) */
  NuxeoPrincipal_Get: 'NuxeoPrincipal.Get',
  /** PDF: Add Page Numbers - Add the page numbers to the PDF, using the misc parameters. If the PDF is encrypted, a password is required. */
  PDF_AddPageNumbers: 'PDF.AddPageNumbers',
  /** PDF: Convert to Pictures - Convert each page of a PDF into a picture. Returns Blob list of pictures. */
  PDF_ConvertToPictures: 'PDF.ConvertToPictures',
  /** PDF: Encrypt - Encrypts the PDF with the given permissions, returning a copy. Permissions are print, modify, copy, modifyAnnot, fillForms, extractForAccessibility, assemble and printDegraded. Any missing permission is set to false (values are true or false, assemble=true for example). originalOwnerPwd is used if the PDF was originally encrypted. If no keyLength is provided, use 128. If the operation is ran on Document(s), xpath lets you specificy where to get the blob from (default: file:content). */
  PDF_Encrypt: 'PDF.Encrypt',
  /** PDF: Encrypt Read Only - Encrypts the PDF, returning a copy. User can read, print and copy but cannot modify. originalOwnerPwd is used if the PDF was originally encrypted. If ownerPwd is empty, use originalOwnerPwd to encrypt. If no keyLength is provided, use 128. If the operation is ran on Document(s), xpath lets you specificy where to get the blob from (default: file:content). */
  PDF_EncryptReadOnly: 'PDF.EncryptReadOnly',
  /** PDF: Extract Info - Extract the info of the PDF stored in <code>xpath</code> and put it in the fields referenced by <code>properties</code>. <code>properties</code> is a <code>key=value</code> list (one key-value pair/line, where <code>key</code> is the xpath of the destination field and <code>value</code> is the exact label (case sensitive) as returned by the PageExtractor (see this operation documentation). If there is no blob or the blob is not a PDF, all the values referenced in <code>properties</code> are cleared (set to empty string, 0, ...). */
  PDF_ExtractInfo: 'PDF.ExtractInfo',
  /** PDF: Extract Links - Returns a JSON string of an array of objects with page, subType, text and link fields. If getAll is true, returns all the links (Remote Go To, Launch and URI in the current version). */
  PDF_ExtractLinks: 'PDF.ExtractLinks',
  /** PDF: Extract Pages - Extract pages from <code>startPage</code> to <code>endPage</code> (inclusive) from the input object. If a Blob is used as input, the <code>xpath</xpath> parameter is not used. <code>title</code>, <code>subject</code> and <code>author</code> are optional. If the PDF is encrypted, a password is required. */
  PDF_ExtractPages: 'PDF.ExtractPages',
  /** PDF: Extract Text - Extracts raw text from a PDF. If the PDF is encrypted, a password is required. pdfxpath is the xpath of the blob (default to file:content). The extracted text is set in the targetxpath property of the input document, which is saved if save is true. If patterntofind is not provided, extracts all the text it can, else it extracts only the line where the pattern is found. If patterntofind is provided and removepatternfromresult is true, the line is returned without the pattern. */
  PDF_ExtractText: 'PDF.ExtractText',
  /** PDF: Merge with Blob(s)  - The input blob(s) always is(are) the first PDFs. The operation appends the blob referenced in the <code>toAppendVarName</code> Context variable. It then appends all the blobs stored in the <code>toAppendListVarName</code> Context variable. Returns the final PDF. */
  PDF_MergeWithBlobs: 'PDF.MergeWithBlobs',
  /** PDF: Merge with Document(s) - The input document(s) always is(are) the first PDFs, and their PDF is read in the <code>xpath</code> field (but it is ok for the input doc to have no blob). The operation appends the blob referenced in the <code>toAppendVarName</code> Context variable. It then appends all the blobs stored in the <code>toAppendListVarName</code> Context variable. It then append the blobs stored in the docs whose IDs are passed in <code>toAppendDocIDsVarName</code> (the same <code>xpath</code> is used). Returns the final PDF. */
  PDF_MergeWithDocs: 'PDF.MergeWithDocs',
  /** PDF: Remove Encryption - Removes the encryption, returns a copy of the blob. If the operation is ran on Document(s), xpath lets you specificy where to get the blob from (default: file:content). */
  PDF_RemoveEncryption: 'PDF.RemoveEncryption',
  /** PDF: Watermark with Image - <p>Return a <em>new</em> blob combining the input PDF and the<code> image </code>blob.</p><p>Properties must be one or more of the following (the default if the property is not set):</p><ul><li><code>scale </code>(1.0) : 1.0 is the original size of the picture</li><li><code>alphaColor</code> (0.5) : 0 is full transparency, 1 is solid</li><li><code>xPosition </code>(0) : in pixels from left or between 0 (left) and 1 (right) if relativeCoordinates is set to true</li><li><code>yPosition</code> (0) : in pixels from bottom or between 0 (bottom) and 1 (top) if relativeCoordinates is set to true</li><li><code>invertX</code> (false) : xPosition starts from the right going left</li><li><code>invertY</code> (false) : yPosition starts from the top going down</li><li><code>relativeCoordinates</code> (false)</li></ul> */
  PDF_WatermarkWithImage: 'PDF.WatermarkWithImage',
  /** PDF: Watermark with PDF - Returns a new blob combining the input PDF and an overlaid PDF on every page. */
  PDF_WatermarkWithPDF: 'PDF.WatermarkWithPDF',
  /** PDF: Watermark with Text - <p>Return a <em>new</em> blob combining the input PDF and the <code>text</code> text.</p><p>Properties must be one or more of the following (the default if the property is not set):</p><ul><li><code>fontFamily</code> (Helvetica) </li><li><code>fontSize</code> (72)</li><li><code>rotation</code> (0): in&nbsp;counterclockwise degrees</li><li><code>hex255Color</code> (#000000)</li><li><code>alphaColor</code> (0.5) : 0 is full transparency, 1 is solid</li><li><code>xPosition</code> (0) : in pixels from left or between 0 (left) and 1 (right) if relativeCoordinates is set to true</li><li><code>yPosition</code> (0) : in pixels from bottom or between 0 (bottom) and 1 (top) if relativeCoordinates is set to true</li><li><code>invertX</code> (false) : xPosition starts from the right going left</li><li><code>invertY</code> (false) : yPosition starts from the top going down</li><li><code>relativeCoordinates</code> (false)</li></ul> */
  PDF_WatermarkWithText: 'PDF.WatermarkWithText',
  /** Archiving ACEs - Schedule a work to archive ACEs based on permissions_purge page provider from the input document. */
  PermissionsPurge: 'PermissionsPurge',
  /** Create Picture - Create a Picture document in the input folder. You can initialize the document properties using the 'properties' parameter. The properties are specified as <i>key=value</i> pairs separated by a new line. The key <i>originalPicture</i> is used to reference the JSON representation of the Blob for the original picture. The <i>pictureTemplates</i> parameter can be used to define the size of the different views to be generated, each line must be a JSONObject { title="title", description="description", maxsize=maxsize}. Returns the created document. */
  Picture_Create: 'Picture.Create',
  /** Get image view - Get an image from a Picture document. (Alias for Picture.GetView) */
  Picture_getView: 'Picture.getView',
  /** Get image view - Get an image from a Picture document. */
  Picture_GetView: 'Picture.GetView',
  /** Recompute Picture Views - Recompute the picture views of the documents resulting from the provided NXQL query. */
  Picture_RecomputeViews: 'Picture.RecomputeViews',
  /** Resize a picture - Use conversion service to resize a picture contained in a Document or a Blob (Alias for Picture.Resize) */
  Picture_resize: 'Picture.resize',
  /** Resize a picture - Use conversion service to resize a picture contained in a Document or a Blob */
  Picture_Resize: 'Picture.Resize',
  /** Get Live Document - Get the live document even if this is a Proxy or Version Document. */
  Proxy_GetSourceDocument: 'Proxy.GetSourceDocument',
  /** Recompute Thumbnails - Recompute the thumbnail of the documents resulting from the provided NXQL query. */
  RecomputeThumbnails: 'RecomputeThumbnails',
  /** reinitAssigneeComment */
  reinitAssigneeComment: 'reinitAssigneeComment',
  /** rejectComment */
  rejectComment: 'rejectComment',
  /** Create Relation - Create a relation between 2 documents. The subject of the relation will be the input of the operation and the object of the relation will be retrieved from the context using the 'object' field. The 'predicate' field specifies the relation predicate (When using a known predicate, use the full URL like 'http://purl.org/dc/terms/IsBasedOn', unknown predicates will be treated as plain strings and be the same on the subject and object). The 'outgoing' flag indicates the direction of the relation - the default is false which means the relation will go from the input object to the object specified as 'object' parameter. Return back the subject document. (Alias for Document.AddRelation) */
  Relations_CreateRelation: 'Relations.CreateRelation',
  /** Delete Relation - Delete a relation between 2 documents. The subject of the relation will be the input of the operation and the object of the relation will be retrieved from the context using the 'object' field. The 'predicate' field specifies the relation predicate (When using a known predicate, use the full URL like 'purl.org/dc/terms/IsBasedOn', unknown predicates will be treated as plain strings and be the same on the subject and object). The 'outgoing' flag indicates the direction of the relation - the default is false which means the relation will go from the input object to the object specified as 'object' parameter. Return back the subject document. (Alias for Document.DeleteRelation) */
  Relations_DeleteRelation: 'Relations.DeleteRelation',
  /** Get Linked Documents - Get the relations for the input document. The 'outgoing' parameter ca be used to specify whether outgoing or incoming relations should be returned. Retuns a document list. (Alias for Document.GetLinkedDocuments) */
  Relations_GetRelations: 'Relations.GetRelations',
  /** Remove Entry Of Multivalued Property - Remove the first entry of the giving value in the multivalued xpath, does nothing if does not exist: <ul<li>if 'is Remove All' is check, all entry instance in the list.</li><li>if not will remove just the first one found</li></ul><p>Save parameter automatically saves the document in the database. It has to be turned off when this operation is used in the context of the empty document created, about to create, before document modification, document modified events.</p> (Alias for Document.RemoveEntryOfMultivaluedProperty) */
  RemoveEntryOfMultivaluedProperty: 'RemoveEntryOfMultivaluedProperty',
  /** Render Document - Get a document or a list of document in input and outputs one or more blobs that contain a rendered view for each input document given a rendering template. The template attribute may contain either the template content either a template URI. Template URis are strings in the form 'template:template_name' and will be located using the runtime resource service. Return the rendered file(s) as blob(s) */
  Render_Document: 'Render.Document',
  /** Render Document Feed - Get a list of documents as input and outputs a single blob containing the rendering of the document list. The template attribute may contain either the template content either a template URI. Template URis are strings in the form 'template:template_name' and will be located using the runtime resource service. Return the rendered blob */
  Render_DocumentFeed: 'Render.DocumentFeed',
  /** Document - Fetch a document from the repository given its reference (path or UID). The document will become the input of the next operation. */
  Repository_GetDocument: 'Repository.GetDocument',
  /** PageProvider - Perform a named provider query on the repository. Result is paginated. The query result will become the input for the next operation. */
  Repository_PageProvider: 'Repository.PageProvider',
  /** Query - Perform a query on the repository. The document list returned will become the input for the next operation.If no provider name is given, a query returning all the documents that the user has access to will be executed. */
  Repository_Query: 'Repository.Query',
  /** QueryAndFetch - Perform a named provider query on the repository. Result is paginated.The result is returned as a RecordSet (QueryAndFetch) rather than as a List of DocumentThe query result will become the input for the next operation. */
  Repository_ResultSetPageProvider: 'Repository.ResultSetPageProvider',
  /** ResultSet Query - Perform a query on the repository. The result set returned will become the input for the next operation. If no query or provider name is given, a query returning all the documents that the user has access to will be executed. */
  Repository_ResultSetQuery: 'Repository.ResultSetQuery',
  /** Save Session - Commit any changes made by the operation on the documents. This can be used to explicitly commit changes. This operation can be executed on any type of input. The input of this operation will be preserved as the input for the next operation in the chain. */
  Repository_SaveSession: 'Repository.SaveSession',
  /** QueryAndFetch - Perform a named provider query on the repository. Result is paginated.The result is returned as a RecordSet (QueryAndFetch) rather than as a List of DocumentThe query result will become the input for the next operation. (Alias for Repository.ResultSetPageProvider) */
  Resultset_PageProvider: 'Resultset.PageProvider',
  /** ResultSet Query - Perform a query on the repository. The result set returned will become the input for the next operation. If no query or provider name is given, a query returning all the documents that the user has access to will be executed. (Alias for Repository.ResultSetQuery) */
  ResultSet_PaginatedQuery: 'ResultSet.PaginatedQuery',
  /** Run Document Chain - Run an operation chain which is returning a document in the current context. The input for the chain ro run is the current input of the operation. Return the output of the chain as a document. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. */
  RunDocumentOperation: 'RunDocumentOperation',
  /** Run File Chain - Run an operation chain which is returning a file in the current context. The input for the chain to run is a file or a list of files. Return the output of the chain as a file or a list of files. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. */
  RunFileOperation: 'RunFileOperation',
  /** Run Input Script - Run a script from the input blob. A blob comtaining script result is returned. */
  RunInputScript: 'RunInputScript',
  /** Run Chain - Run an operation chain in the current context. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. */
  RunOperation: 'RunOperation',
  /** Run For Each - Run an operation for each element from the list defined by the 'list' parameter. The 'list' parameter is pointing to a context variable that represents the list which will be iterated. The 'item' parameter represents the name of the context variable which will point to the current element in the list at each iteration. You can use the 'isolate' parameter to specify whether or not the evalution context is the same as the parent context or a copy of it. If the 'isolate' parameter is 'true' then a copy of the current context is used and so that modifications in this context will not affect the parent context. Any input is accepted. The input is returned back as output when operation terminates. The 'parameters' injected are accessible in the subcontext ChainParameters. For instance, @{ChainParameters['parameterKey']}. */
  RunOperationOnList: 'RunOperationOnList',
  /** Run For Each Page - Run an operation for each page of the provider defined by the provider name, the operation input is the curent page  */
  RunOperationOnProvider: 'RunOperationOnProvider',
  /** Run Script - Run a script which content is specified as text in the 'script' parameter */
  RunScript: 'RunScript',
  /** Indexing - Enable to index Nuxeo documents. */
  Search_Index: 'Search.Index',
  /** Suggesters launcher - Get and launch the suggesters defined and return a list of Suggestion objects. */
  Search_SuggestersLauncher: 'Search.SuggestersLauncher',
  /** Wait for Indexing - Wait until indexing is done, only for testing purpose. */
  Search_WaitForIndexing: 'Search.WaitForIndexing',
  /** Hot Reload Studio Snapshot Package - Updates Studio project with latest snapshot. */
  Service_HotReloadStudioSnapshot: 'Service.HotReloadStudioSnapshot',
  /** Create or Update User - Create or Update User. (Alias for User.CreateOrUpdate) */
  Services_CreateUser: 'Services.CreateUser',
  /** Query users - Query users on a combination of their username, firstName and lastName fields, or on any of them (pattern). (Alias for User.Query) */
  Services_QueryUsers: 'Services.QueryUsers',
  /** Remove All Document Tags - Remove all document tags. */
  Services_RemoveDocumentTags: 'Services.RemoveDocumentTags',
  /** Tag Document - Tag document with one or several 'tags'. */
  Services_TagDocument: 'Services.TagDocument',
  /** Untag Document - Untag document from one or several 'tags'. */
  Services_UntagDocument: 'Services.UntagDocument',
  /** Get tag suggestion */
  Tag_Suggestion: 'Tag.Suggestion',
  /** Apply mapping on input task doc - Applies the mapping passed in parameter on the task document. The sourceDoc in the mapping is the input document in the workflow. The operation throws a NuxeoException if the input document is not a Task. */
  Task_ApplyDocumentMapping: 'Task.ApplyDocumentMapping',
  /** Create task - Enable to create a task bound to the document. <p><b>Directive</b>, <b>comment</b> and <b>due date</b> will be displayed in the task list of the user. In <b>accept operation chain</b> and <b>reject operation chain</b> fields, you can put the operation chain ID of your choice among the one you contributed. Those operations will be executed when the user validates the task, depending on  whether he accepts or rejects the task. You have to specify a variable name (the <b>key for ... </b> parameter) to resolve target users and groups to which the task will be assigned. You can use Get Users and Groups to update a context variable with some users and groups. If you check <b>create one task per actor</b>, each of the actors will have a task to achieve, versus "the first who achieve the task makes it disappear for the others".</p> */
  Task_Create: 'Task.Create',
  /** Get user tasks - List tasks assigned to this user or one of its group.Task properties are serialized using JSON and returned in a Blob. */
  Task_GetAssigned: 'Task.GetAssigned',
  /** terminateWorkflow */
  terminateWorkflow: 'terminateWorkflow',
  /** Traces.getTrace - Retrieve trace associated to a Chain or an Operation */
  Traces_Get: 'Traces.Get',
  /** Traces.toggleRecording - Toggle Automation call tracing (you can set the 'enableTrace' parameter if you want to explicitly set the traceEnable value */
  Traces_ToggleRecording: 'Traces.ToggleRecording',
  /** updateCommentsOnDoc */
  updateCommentsOnDoc: 'updateCommentsOnDoc',
  /** Create or Update User - Create or Update User. */
  User_CreateOrUpdate: 'User.CreateOrUpdate',
  /** Get Nuxeo Principal - Retrieve Nuxeo principal and export it as a DocumentModel, if login parameter is not set the Operation will return informations about the current user, otherwise Directory Administration rights are required. */
  User_Get: 'User.Get',
  /** Get collections - Get the list of all the collections visible by the currentUser. This is returning a list of collections. */
  User_GetCollections: 'User.GetCollections',
  /** Get Home - Retrieve user's personal workspace. */
  User_GetUserWorkspace: 'User.GetUserWorkspace',
  /** Invite a user - Stores a registration request and returns its ID. */
  User_Invite: 'User.Invite',
  /** Query users - Query users on a combination of their username, firstName and lastName fields, or on any of them (pattern). */
  User_Query: 'User.Query',
  /** Get user/group suggestion - Get the user/group list of the running instance. This is returning a blob containing a serialized JSON array.. */
  UserGroup_Suggestion: 'UserGroup.Suggestion',
  /** Create Document from file in User's workspace - Create Document(s) in the user's workspace from Blob(s) using the FileManagerService. */
  UserWorkspace_CreateDocumentFromBlob: 'UserWorkspace.CreateDocumentFromBlob',
  /** Get Home - Retrieve user's personal workspace. (Alias for User.GetUserWorkspace) */
  UserWorkspace_Get: 'UserWorkspace.Get',
  /** validateDocument */
  validateDocument: 'validateDocument',
  /** VersionAndAttachFile */
  VersionAndAttachFile: 'VersionAndAttachFile',
  /** VersionAndAttachFiles */
  VersionAndAttachFiles: 'VersionAndAttachFiles',
  /** Watermarks a Video with a Picture - Watermark the video with the picture stored in file:content of watermark, at the position(x, y) from the left-top corner of the picture. */
  Video_AddWatermark: 'Video.AddWatermark',
  /** Joins two or more videos sequentially. - Merge 2-n videos in one. */
  Video_Concat: 'Video.Concat',
  /** Extracts closed captions from the video. - Extracts the closed captions from the whole video or from a part of it when startAt and end time is provided. The output format references how the output is generated, and xpath can be used to indicate the video blob when using documents. */
  Video_ExtractClosedCaptions: 'Video.ExtractClosedCaptions',
  /** SliceVideo the video for a given duration and startAt time. - SliceVideo the input blob starting at startAt, for a certain duration. The duration and startAt arguments are optional, but not simultaneously. A specific converter can be used. */
  Video_Slice: 'Video.Slice',
  /** SliceVideo a Video in Parts with equal duration. - Slices the video in n parts of approximately the same duration each. */
  Video_SliceInParts: 'Video.SliceInParts',
  /** voidChain */
  voidChain: 'voidChain',
  /** Complete task - Completes the input task. If this is the last task the workflow will continue. Returns back the task document. "Status" is the id of the button the user would have clicked to submit the task form (if the outgoing transitions of the workflow node that created the task have conditions depending on it).@since 5.9.3 and 5.8.0-HF11 you can set multiple  node or workflow variables when completing the task (also similar to ending the task via form submision from the UI).The variables are specified as <i>key=value</i> pairs separated by a new line.To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>workflowVarString=A sample value<br>workflowVarDate=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p>For all values, you have to submit a JSON representation. This is an example for a variable of type StringList:<p><pre>nodeVarList = ["John Doe", "John Test"]</pre></p> (Alias for WorkflowTask.Complete) */
  Workflow_CompleteTaskOperation: 'Workflow.CompleteTaskOperation',
  /** Create task - Enable to create a task bound to the document. <p><b>Directive</b>, <b>comment</b> and <b>due date</b> will be displayed in the task list of the user. In <b>accept operation chain</b> and <b>reject operation chain</b> fields, you can put the operation chain ID of your choice among the one you contributed. Those operations will be executed when the user validates the task, depending on  whether he accepts or rejects the task. You have to specify a variable name (the <b>key for ... </b> parameter) to resolve target users and groups to which the task will be assigned. You can use Get Users and Groups to update a context variable with some users and groups. If you check <b>create one task per actor</b>, each of the actors will have a task to achieve, versus "the first who achieve the task makes it disappear for the others".</p> (Alias for Task.Create) */
  Workflow_CreateTask: 'Workflow.CreateTask',
  /** Get open tasks - Returns all open tasks for the input document(s). If the operation is invoked with parameters, all tasks instances for the given 'processId' originating from the given 'nodeId' are returned. The 'processId' is the id of the document representing the workflow instance. The parameter 'username' is used to fetch only tasks assigned to the given user. Tasks are queried using an unrestricted session. */
  Workflow_GetOpenTasks: 'Workflow.GetOpenTasks',
  /** Get user tasks - List tasks assigned to this user or one of its group.Task properties are serialized using JSON and returned in a Blob. (Alias for Task.GetAssigned) */
  Workflow_GetTask: 'Workflow.GetTask',
  /** Resume workflow - Resumes a route instance on a given node. When a parameter is not specified, it will be fetched from the current context if the operation is executed in the context of a running workflow (it applies to the current workflow and to the current node). */
  Workflow_ResumeNode: 'Workflow.ResumeNode',
  /** Resume workflow - Resumes a route instance on a given node. When a parameter is not specified, it will be fetched from the current context if the operation is executed in the context of a running workflow (it applies to the current workflow and to the current node). (Alias for Workflow.ResumeNode) */
  Workflow_ResumeNodeOperation: 'Workflow.ResumeNodeOperation',
  /** Set Node Variable - Set a workflow node variable given a name and the value in the context of a running workflow. To compute the value at runtime from the current context you should use an EL expression as the value. This operation works on any input type and return back the input as the output. */
  Workflow_SetNodeVariable: 'Workflow.SetNodeVariable',
  /** UserTaskPageProvider - Returns the tasks waiting for the current user. */
  Workflow_UserTaskPageProvider: 'Workflow.UserTaskPageProvider',
  /** Cancel workflow - Cancel the workflow with the given id, where the required id is the id of the document representing the workflow instance. */
  WorkflowInstance_Cancel: 'WorkflowInstance.Cancel',
  /** Bulk Restart Workflow - Bulk operation to restart workflows. */
  WorkflowModel_BulkRestartInstances: 'WorkflowModel.BulkRestartInstances',
  /** Complete task - Completes the input task. If this is the last task the workflow will continue. Returns back the task document. "Status" is the id of the button the user would have clicked to submit the task form (if the outgoing transitions of the workflow node that created the task have conditions depending on it).@since 5.9.3 and 5.8.0-HF11 you can set multiple  node or workflow variables when completing the task (also similar to ending the task via form submision from the UI).The variables are specified as <i>key=value</i> pairs separated by a new line.To specify multi-line values you can use a \ character followed by a new line. <p>Example:<pre>description=foo bar</pre>For updating a date, you will need to expose the value as ISO 8601 format, for instance : <p>Example:<pre>workflowVarString=A sample value<br>workflowVarDate=@{org.nuxeo.ecm.core.schema.utils.DateParser.formatW3CDateTime(CurrentDate.date)}</pre><p>For all values, you have to submit a JSON representation. This is an example for a variable of type StringList:<p><pre>nodeVarList = ["John Doe", "John Test"]</pre></p> */
  WorkflowTask_Complete: 'WorkflowTask.Complete',
  /** Executes Works stored in the dead letter queue - Try to execute again Works that have been send to a dead letter queue by the WorkManager after failure */
  WorkManager_RunWorkInFailure: 'WorkManager.RunWorkInFailure',
  /** xmlExportRendition */
  xmlExportRendition: 'xmlExportRendition',
  /** zipTreeExportRendition */
  zipTreeExportRendition: 'zipTreeExportRendition',
} as const;

/**
 * Nuxeo Document Types (50 types)
 * 
 * Document type constants representing the various content types
 * available in the Nuxeo repository.
 */
export const NUXEO_DOCUMENT_TYPES = {
  /** AdministrativeStatus (Facets: SystemDocument, HiddenInNavigation) */
  AdministrativeStatus: 'AdministrativeStatus',
  /** AdministrativeStatusContainer (Facets: SystemDocument, Folderish, NXTag, HiddenInNavigation) */
  AdministrativeStatusContainer: 'AdministrativeStatusContainer',
  /** AdvancedContent */
  AdvancedContent: 'AdvancedContent',
  /** AdvancedSearch */
  AdvancedSearch: 'AdvancedSearch',
  /** Annotation (Facets: HiddenInNavigation) */
  Annotation: 'Annotation',
  /** AssetsSearch (Facets: ContentViewDisplay, SavedSearch, HiddenInNavigation) */
  AssetsSearch: 'AssetsSearch',
  /** Audio (Facets: Versionable, NXTag, Publishable, Commentable, Audio) */
  Audio: 'Audio',
  /** BasicAuditSearch */
  BasicAuditSearch: 'BasicAuditSearch',
  /** Collection (Facets: Versionable, NXTag, Collection, NotCollectionMember) */
  Collection: 'Collection',
  /** Collections (Facets: Folderish, NXTag, NotCollectionMember) */
  Collections: 'Collections',
  /** Comment (Facets: HiddenInNavigation) */
  Comment: 'Comment',
  /** CommentRoot (Facets: Folderish, NXTag, HiddenInNavigation, HiddenInCreation) */
  CommentRoot: 'CommentRoot',
  /** DefaultRelation (Facets: HiddenInNavigation) */
  DefaultRelation: 'DefaultRelation',
  /** DefaultSearch (Facets: ContentViewDisplay, SavedSearch, HiddenInNavigation) */
  DefaultSearch: 'DefaultSearch',
  /** Document */
  Document: 'Document',
  /** DocumentRoute (Facets: SystemDocument, Folderish, ForceAudit, NXTag, HiddenInNavigation, Orderable, DocumentRoute) */
  DocumentRoute: 'DocumentRoute',
  /** DocumentRouteInstancesRoot (Facets: SystemDocument, Folderish, NXTag, HiddenInNavigation, HiddenInCreation) */
  DocumentRouteInstancesRoot: 'DocumentRouteInstancesRoot',
  /** DocumentRouteModelsRoot (Facets: SystemDocument, Folderish, NXTag, HiddenInNavigation, HiddenInCreation) */
  DocumentRouteModelsRoot: 'DocumentRouteModelsRoot',
  /** Domain (Facets: Folderish, NXTag, SuperSpace, NotCollectionMember) */
  Domain: 'Domain',
  /** ExpiredSearch (Facets: SavedSearch, HiddenInNavigation) */
  ExpiredSearch: 'ExpiredSearch',
  /** Favorites (Facets: Collection, NotCollectionMember) */
  Favorites: 'Favorites',
  /** File (Facets: Versionable, NXTag, Publishable, Commentable, HasRelatedText, Downloadable) */
  File: 'File',
  /** Folder (Facets: Folderish, NXTag) */
  Folder: 'Folder',
  /** HiddenFolder (Facets: Folderish, NXTag, HiddenInNavigation) */
  HiddenFolder: 'HiddenFolder',
  /** ManagementRoot (Facets: SystemDocument, Folderish, NXTag, HiddenInNavigation) */
  ManagementRoot: 'ManagementRoot',
  /** Note (Facets: Versionable, NXTag, Publishable, Commentable, HasRelatedText) */
  Note: 'Note',
  /** OrderedFolder (Facets: Folderish, NXTag, Orderable) */
  OrderedFolder: 'OrderedFolder',
  /** PermissionsSearch */
  PermissionsSearch: 'PermissionsSearch',
  /** Picture (Facets: Versionable, NXTag, Publishable, Picture, Commentable, HasRelatedText) */
  Picture: 'Picture',
  /** PictureBook (Facets: Folderish, NXTag) */
  PictureBook: 'PictureBook',
  /** PublicationRelation (Facets: HiddenInNavigation) */
  PublicationRelation: 'PublicationRelation',
  /** Relation */
  Relation: 'Relation',
  /** Root (Facets: Folderish, NXTag, NotCollectionMember) */
  Root: 'Root',
  /** RouteNode (Facets: SystemDocument, NotFulltextIndexable, HiddenInNavigation) */
  RouteNode: 'RouteNode',
  /** RoutingTask (Facets: Task, RoutingTask, HiddenInNavigation) */
  RoutingTask: 'RoutingTask',
  /** SavedSearch (Facets: SavedSearch, HiddenInNavigation) */
  SavedSearch: 'SavedSearch',
  /** Section (Facets: Folderish, NXTag, SuperSpace, PublishSpace) */
  Section: 'Section',
  /** SectionRoot (Facets: Folderish, NXTag, SuperSpace, HiddenInCreation, NotCollectionMember, MasterPublishSpace) */
  SectionRoot: 'SectionRoot',
  /** Tag (Facets: HiddenInNavigation) */
  Tag: 'Tag',
  /** Tagging (Facets: HiddenInNavigation) */
  Tagging: 'Tagging',
  /** TaskDoc (Facets: Task, HiddenInNavigation) */
  TaskDoc: 'TaskDoc',
  /** TaskRoot (Facets: Folderish, NXTag, HiddenInNavigation, SuperSpace) */
  TaskRoot: 'TaskRoot',
  /** TemplateRoot (Facets: Folderish, NXTag, SuperSpace, HiddenInCreation, NotCollectionMember) */
  TemplateRoot: 'TemplateRoot',
  /** UserInvitation (Facets: Versionable, NXTag, HiddenInNavigation, Publishable, Commentable, HasRelatedText, UserInvitation, Downloadable) */
  UserInvitation: 'UserInvitation',
  /** UserInvitationContainer (Facets: Folderish, NXTag, HiddenInNavigation, SuperSpace) */
  UserInvitationContainer: 'UserInvitationContainer',
  /** UserProfile (Facets: UserProfile, HiddenInNavigation) */
  UserProfile: 'UserProfile',
  /** UserWorkspacesRoot (Facets: Folderish, NXTag, HiddenInNavigation, SuperSpace) */
  UserWorkspacesRoot: 'UserWorkspacesRoot',
  /** Video (Facets: Versionable, NXTag, Publishable, Video, HasStoryboard, Commentable, HasVideoPreview) */
  Video: 'Video',
  /** Workspace (Facets: Folderish, NXTag, SuperSpace) */
  Workspace: 'Workspace',
  /** WorkspaceRoot (Facets: Folderish, NXTag, SuperSpace, HiddenInCreation, NotCollectionMember) */
  WorkspaceRoot: 'WorkspaceRoot',
} as const;

/**
 * Nuxeo Schemas (86 schemas)
 * 
 * Schema constants representing the metadata schemas
 * used by documents in the Nuxeo repository.
 */
export const NUXEO_SCHEMAS = {
  /** aceinfo (prefix: aceinfo) */
  aceinfo: 'aceinfo',
  /** advanced_content (prefix: advanced_content) */
  advanced_content: 'advanced_content',
  /** advanced_search (prefix: search) */
  advanced_search: 'advanced_search',
  /** annotation (prefix: annotation) */
  annotation: 'annotation',
  assets_search: 'assets_search',
  /** audio (prefix: aud) */
  audio: 'audio',
  authtoken: 'authtoken',
  /** basicauditsearch (prefix: bas) */
  basicauditsearch: 'basicauditsearch',
  /** collection (prefix: collection) */
  collection: 'collection',
  /** collectionMember (prefix: collectionMember) */
  collectionMember: 'collectionMember',
  /** comment (prefix: comment) */
  comment: 'comment',
  common: 'common',
  /** content_view_configuration (prefix: cvconf) */
  content_view_configuration: 'content_view_configuration',
  /** content_view_display (prefix: cvd) */
  content_view_display: 'content_view_display',
  /** default_search (prefix: defaults) */
  default_search: 'default_search',
  digestauth: 'digestauth',
  /** directory_configuration (prefix: dirconf) */
  directory_configuration: 'directory_configuration',
  /** document_route_instance (prefix: docri) */
  document_route_instance: 'document_route_instance',
  /** document_route_model (prefix: docrm) */
  document_route_model: 'document_route_model',
  documentsLists: 'documentsLists',
  domain: 'domain',
  /** driveroot (prefix: drv) */
  driveroot: 'driveroot',
  /** dublincore (prefix: dc) */
  dublincore: 'dublincore',
  /** expired_search (prefix: expired_search) */
  expired_search: 'expired_search',
  /** externalEntity (prefix: externalEntity) */
  externalEntity: 'externalEntity',
  /** facetedTag (prefix: nxtag) */
  facetedTag: 'facetedTag',
  file: 'file',
  files: 'files',
  group: 'group',
  /** image_metadata (prefix: imd) */
  image_metadata: 'image_metadata',
  /** info_comments (prefix: infocom) */
  info_comments: 'info_comments',
  /** iptc (prefix: iptc) */
  iptc: 'iptc',
  l10nvocabulary: 'l10nvocabulary',
  l10nxvocabulary: 'l10nxvocabulary',
  note: 'note',
  /** notification (prefix: notif) */
  notification: 'notification',
  oauth2Client: 'oauth2Client',
  oauth2ServiceProvider: 'oauth2ServiceProvider',
  oauth2Token: 'oauth2Token',
  oauthConsumer: 'oauthConsumer',
  oauthServiceProvider: 'oauthServiceProvider',
  oauthToken: 'oauthToken',
  /** permissions_search (prefix: rs) */
  permissions_search: 'permissions_search',
  picture: 'picture',
  picturebook: 'picturebook',
  /** publishing (prefix: publish) */
  publishing: 'publishing',
  /** registration (prefix: registration) */
  registration: 'registration',
  /** registrationconfiguration (prefix: registrationconfiguration) */
  registrationconfiguration: 'registrationconfiguration',
  relatedtext: 'relatedtext',
  /** relation (prefix: relation) */
  relation: 'relation',
  /** rendition (prefix: rend) */
  rendition: 'rendition',
  /** route_node (prefix: rnode) */
  route_node: 'route_node',
  /** saved_search (prefix: saved) */
  saved_search: 'saved_search',
  /** simpleconfiguration (prefix: sconf) */
  simpleconfiguration: 'simpleconfiguration',
  status: 'status',
  /** tag (prefix: tag) */
  tag: 'tag',
  /** task (prefix: nt) */
  task: 'task',
  /** thumbnail (prefix: thumb) */
  thumbnail: 'thumbnail',
  /** ui_types_configuration (prefix: uitypesconf) */
  ui_types_configuration: 'ui_types_configuration',
  uid: 'uid',
  user: 'user',
  /** userinfo (prefix: userinfo) */
  userinfo: 'userinfo',
  /** userprofile (prefix: userprofile) */
  userprofile: 'userprofile',
  /** var_global_Task2169 (prefix: var_global_Task2169) */
  var_global_Task2169: 'var_global_Task2169',
  /** var_global_Task2556 (prefix: var_global_Task2556) */
  var_global_Task2556: 'var_global_Task2556',
  /** var_global_Task328d (prefix: var_global_Task328d) */
  var_global_Task328d: 'var_global_Task328d',
  /** var_global_Task38e (prefix: var_global_Task38e) */
  var_global_Task38e: 'var_global_Task38e',
  /** var_global_Task6d8 (prefix: var_global_Task6d8) */
  var_global_Task6d8: 'var_global_Task6d8',
  /** var_ParallelDocumentReview (prefix: var_ParallelDocumentReview) */
  var_ParallelDocumentReview: 'var_ParallelDocumentReview',
  /** var_SerialDocumentReview (prefix: var_SerialDocumentReview) */
  var_SerialDocumentReview: 'var_SerialDocumentReview',
  /** var_Task2169 (prefix: var_Task2169) */
  var_Task2169: 'var_Task2169',
  /** var_Task21a0 (prefix: var_Task21a0) */
  var_Task21a0: 'var_Task21a0',
  /** var_Task2225 (prefix: var_Task2225) */
  var_Task2225: 'var_Task2225',
  /** var_Task22b4 (prefix: var_Task22b4) */
  var_Task22b4: 'var_Task22b4',
  /** var_Task232e (prefix: var_Task232e) */
  var_Task232e: 'var_Task232e',
  /** var_Task2556 (prefix: var_Task2556) */
  var_Task2556: 'var_Task2556',
  /** var_Task328d (prefix: var_Task328d) */
  var_Task328d: 'var_Task328d',
  /** var_Task375f (prefix: var_Task375f) */
  var_Task375f: 'var_Task375f',
  /** var_Task38e (prefix: var_Task38e) */
  var_Task38e: 'var_Task38e',
  /** var_Task542 (prefix: var_Task542) */
  var_Task542: 'var_Task542',
  /** var_Task5c1 (prefix: var_Task5c1) */
  var_Task5c1: 'var_Task5c1',
  /** var_Task6d8 (prefix: var_Task6d8) */
  var_Task6d8: 'var_Task6d8',
  /** video (prefix: vid) */
  video: 'video',
  vocabulary: 'vocabulary',
  /** webcontainer (prefix: webc) */
  webcontainer: 'webcontainer',
  xvocabulary: 'xvocabulary',
} as const;

/**
 * Nuxeo Facets (64 facets)
 * 
 * Facet constants representing the behaviors and capabilities
 * that can be applied to documents in the Nuxeo repository.
 */
export const NUXEO_FACETS = {
  /** Audio (schemas: [object Object], [object Object]) */
  Audio: 'Audio',
  BigFolder: 'BigFolder',
  /** Collection (schemas: [object Object]) */
  Collection: 'Collection',
  /** CollectionMember (schemas: [object Object]) */
  CollectionMember: 'CollectionMember',
  Commentable: 'Commentable',
  /** CommentsInfoHolder (schemas: [object Object]) */
  CommentsInfoHolder: 'CommentsInfoHolder',
  /** ContentViewDisplay (schemas: [object Object]) */
  ContentViewDisplay: 'ContentViewDisplay',
  /** ContentViewLocalConfiguration (schemas: [object Object]) */
  ContentViewLocalConfiguration: 'ContentViewLocalConfiguration',
  /** DirectoryLocalConfiguration (schemas: [object Object]) */
  DirectoryLocalConfiguration: 'DirectoryLocalConfiguration',
  DocumentRoute: 'DocumentRoute',
  Downloadable: 'Downloadable',
  /** DriveSynchronized (schemas: [object Object]) */
  DriveSynchronized: 'DriveSynchronized',
  /** ExternalEntity (schemas: [object Object]) */
  ExternalEntity: 'ExternalEntity',
  /** facet-var_global_Task2169 (schemas: [object Object]) */
  facet_var_global_Task2169: 'facet-var_global_Task2169',
  /** facet-var_global_Task2556 (schemas: [object Object]) */
  facet_var_global_Task2556: 'facet-var_global_Task2556',
  /** facet-var_global_Task328d (schemas: [object Object]) */
  facet_var_global_Task328d: 'facet-var_global_Task328d',
  /** facet-var_global_Task38e (schemas: [object Object]) */
  facet_var_global_Task38e: 'facet-var_global_Task38e',
  /** facet-var_global_Task6d8 (schemas: [object Object]) */
  facet_var_global_Task6d8: 'facet-var_global_Task6d8',
  /** facet-var_ParallelDocumentReview (schemas: [object Object]) */
  facet_var_ParallelDocumentReview: 'facet-var_ParallelDocumentReview',
  /** facet-var_SerialDocumentReview (schemas: [object Object]) */
  facet_var_SerialDocumentReview: 'facet-var_SerialDocumentReview',
  /** facet-var_Task2169 (schemas: [object Object]) */
  facet_var_Task2169: 'facet-var_Task2169',
  /** facet-var_Task21a0 (schemas: [object Object]) */
  facet_var_Task21a0: 'facet-var_Task21a0',
  /** facet-var_Task2225 (schemas: [object Object]) */
  facet_var_Task2225: 'facet-var_Task2225',
  /** facet-var_Task22b4 (schemas: [object Object]) */
  facet_var_Task22b4: 'facet-var_Task22b4',
  /** facet-var_Task232e (schemas: [object Object]) */
  facet_var_Task232e: 'facet-var_Task232e',
  /** facet-var_Task2556 (schemas: [object Object]) */
  facet_var_Task2556: 'facet-var_Task2556',
  /** facet-var_Task328d (schemas: [object Object]) */
  facet_var_Task328d: 'facet-var_Task328d',
  /** facet-var_Task375f (schemas: [object Object]) */
  facet_var_Task375f: 'facet-var_Task375f',
  /** facet-var_Task38e (schemas: [object Object]) */
  facet_var_Task38e: 'facet-var_Task38e',
  /** facet-var_Task542 (schemas: [object Object]) */
  facet_var_Task542: 'facet-var_Task542',
  /** facet-var_Task5c1 (schemas: [object Object]) */
  facet_var_Task5c1: 'facet-var_Task5c1',
  /** facet-var_Task6d8 (schemas: [object Object]) */
  facet_var_Task6d8: 'facet-var_Task6d8',
  Folderish: 'Folderish',
  ForceAudit: 'ForceAudit',
  /** HasRelatedText (schemas: [object Object]) */
  HasRelatedText: 'HasRelatedText',
  HasStoryboard: 'HasStoryboard',
  HasVideoPreview: 'HasVideoPreview',
  HiddenInCreation: 'HiddenInCreation',
  HiddenInNavigation: 'HiddenInNavigation',
  MasterPublishSpace: 'MasterPublishSpace',
  NotCollectionMember: 'NotCollectionMember',
  NotFulltextIndexable: 'NotFulltextIndexable',
  /** Notifiable (schemas: [object Object]) */
  Notifiable: 'Notifiable',
  /** NXTag (schemas: [object Object]) */
  NXTag: 'NXTag',
  Orderable: 'Orderable',
  /** Picture (schemas: [object Object], [object Object], [object Object]) */
  Picture: 'Picture',
  Publishable: 'Publishable',
  PublishSpace: 'PublishSpace',
  /** RegistrationConfiguration (schemas: [object Object]) */
  RegistrationConfiguration: 'RegistrationConfiguration',
  /** Rendition (schemas: [object Object]) */
  Rendition: 'Rendition',
  Routable: 'Routable',
  RoutingTask: 'RoutingTask',
  /** SavedSearch (schemas: [object Object], [object Object], [object Object], [object Object]) */
  SavedSearch: 'SavedSearch',
  /** SimpleConfiguration (schemas: [object Object]) */
  SimpleConfiguration: 'SimpleConfiguration',
  SuperSpace: 'SuperSpace',
  SystemDocument: 'SystemDocument',
  /** Task (schemas: [object Object]) */
  Task: 'Task',
  /** Thumbnail (schemas: [object Object]) */
  Thumbnail: 'Thumbnail',
  /** UITypesLocalConfiguration (schemas: [object Object]) */
  UITypesLocalConfiguration: 'UITypesLocalConfiguration',
  /** UserInvitation (schemas: [object Object], [object Object]) */
  UserInvitation: 'UserInvitation',
  /** UserProfile (schemas: [object Object]) */
  UserProfile: 'UserProfile',
  Versionable: 'Versionable',
  /** Video (schemas: [object Object], [object Object], [object Object]) */
  Video: 'Video',
  WebView: 'WebView',
} as const;

// Type definitions
export type NuxeoOperation = typeof NUXEO_OPERATIONS[keyof typeof NUXEO_OPERATIONS];
export type NuxeoDocumentType = typeof NUXEO_DOCUMENT_TYPES[keyof typeof NUXEO_DOCUMENT_TYPES];
export type NuxeoSchema = typeof NUXEO_SCHEMAS[keyof typeof NUXEO_SCHEMAS];
export type NuxeoFacet = typeof NUXEO_FACETS[keyof typeof NUXEO_FACETS];

/**
 * Nuxeo Operation Categories (17 categories)
 * 
 * Operations grouped by their functional categories.
 * Useful for organizing and filtering operations.
 */
export const NUXEO_OPERATION_CATEGORIES = {
  Business: [
    NUXEO_OPERATIONS.Business_BusinessCreateOperation,
    NUXEO_OPERATIONS.Business_BusinessFetchOperation,
    NUXEO_OPERATIONS.Business_BusinessUpdateOperation,
  ],
  Chain: [
    NUXEO_OPERATIONS.AttachFiles,
    NUXEO_OPERATIONS.FileManager_ImportWithMetaData,
    NUXEO_OPERATIONS.Image_Blob_ConvertToPDF,
    NUXEO_OPERATIONS.Image_Blob_Resize,
    NUXEO_OPERATIONS.NRD_AC_PR_ChooseParticipants_Output,
    NUXEO_OPERATIONS.NRD_AC_PR_LockDocument,
    NUXEO_OPERATIONS.NRD_AC_PR_UnlockDocument,
    NUXEO_OPERATIONS.NRD_AC_PR_ValidateNode_Output,
    NUXEO_OPERATIONS.NRD_AC_PR_force_validate,
    NUXEO_OPERATIONS.NRD_AC_PR_storeTaskInfo,
    NUXEO_OPERATIONS.VersionAndAttachFile,
    NUXEO_OPERATIONS.VersionAndAttachFiles,
    NUXEO_OPERATIONS.acceptComment,
    NUXEO_OPERATIONS.blobToPDF,
    NUXEO_OPERATIONS.cancelWorkflow,
    NUXEO_OPERATIONS.containerContentBlob,
    NUXEO_OPERATIONS.initInitiatorComment,
    NUXEO_OPERATIONS.logInAudit,
    NUXEO_OPERATIONS.mainBlob,
    NUXEO_OPERATIONS.nextAssignee,
    NUXEO_OPERATIONS.notifyInitiatorEndOfWorkflow,
    NUXEO_OPERATIONS.reinitAssigneeComment,
    NUXEO_OPERATIONS.rejectComment,
    NUXEO_OPERATIONS.terminateWorkflow,
    NUXEO_OPERATIONS.updateCommentsOnDoc,
    NUXEO_OPERATIONS.validateDocument,
    NUXEO_OPERATIONS.voidChain,
    NUXEO_OPERATIONS.xmlExportRendition,
    NUXEO_OPERATIONS.zipTreeExportRendition,
  ],
  Conversion: [
    NUXEO_OPERATIONS.Blob_ConcatenatePDFs,
    NUXEO_OPERATIONS.Blob_Convert,
    NUXEO_OPERATIONS.Blob_RunConverter,
    NUXEO_OPERATIONS.Blob_ToPDF,
    NUXEO_OPERATIONS.PDF_AddPageNumbers,
    NUXEO_OPERATIONS.PDF_ConvertToPictures,
    NUXEO_OPERATIONS.PDF_Encrypt,
    NUXEO_OPERATIONS.PDF_EncryptReadOnly,
    NUXEO_OPERATIONS.PDF_ExtractLinks,
    NUXEO_OPERATIONS.PDF_ExtractPages,
    NUXEO_OPERATIONS.PDF_MergeWithBlobs,
    NUXEO_OPERATIONS.PDF_MergeWithDocs,
    NUXEO_OPERATIONS.PDF_RemoveEncryption,
    NUXEO_OPERATIONS.PDF_WatermarkWithImage,
    NUXEO_OPERATIONS.PDF_WatermarkWithPDF,
    NUXEO_OPERATIONS.PDF_WatermarkWithText,
    NUXEO_OPERATIONS.Picture_GetView,
    NUXEO_OPERATIONS.Picture_Resize,
    NUXEO_OPERATIONS.Picture_getView,
    NUXEO_OPERATIONS.Picture_resize,
    NUXEO_OPERATIONS.Render_Document,
    NUXEO_OPERATIONS.Render_DocumentFeed,
    NUXEO_OPERATIONS.Video_ExtractClosedCaptions,
    NUXEO_OPERATIONS.Video_Slice,
    NUXEO_OPERATIONS.Video_SliceInParts,
  ],
  Document: [
    NUXEO_OPERATIONS.AddEntryToMultivaluedProperty,
    NUXEO_OPERATIONS.Blob_Set,
    NUXEO_OPERATIONS.Collection_AddToCollection,
    NUXEO_OPERATIONS.Collection_AddToFavorites,
    NUXEO_OPERATIONS.Collection_Create,
    NUXEO_OPERATIONS.Collection_CreateCollection,
    NUXEO_OPERATIONS.Collection_GetCollections,
    NUXEO_OPERATIONS.Collection_GetDocumentsFromCollection,
    NUXEO_OPERATIONS.Collection_GetElementsInFavorite,
    NUXEO_OPERATIONS.Collection_RemoveFromCollection,
    NUXEO_OPERATIONS.Collection_RemoveFromFavorites,
    NUXEO_OPERATIONS.Comment_Moderate,
    NUXEO_OPERATIONS.CreateProxyLive,
    NUXEO_OPERATIONS.DocumentMultivaluedProperty_addItem,
    NUXEO_OPERATIONS.Document_AddACE,
    NUXEO_OPERATIONS.Document_AddACL,
    NUXEO_OPERATIONS.Document_AddEntryToMultivaluedProperty,
    NUXEO_OPERATIONS.Document_AddFacet,
    NUXEO_OPERATIONS.Document_AddItemToListProperty,
    NUXEO_OPERATIONS.Document_AddPermission,
    NUXEO_OPERATIONS.Document_AddToCollection,
    NUXEO_OPERATIONS.Document_AddToFavorites,
    NUXEO_OPERATIONS.Document_BlockPermissionInheritance,
    NUXEO_OPERATIONS.Document_CheckIn,
    NUXEO_OPERATIONS.Document_CheckOut,
    NUXEO_OPERATIONS.Document_Copy,
    NUXEO_OPERATIONS.Document_CopySchema,
    NUXEO_OPERATIONS.Document_Create,
    NUXEO_OPERATIONS.Document_CreateLiveProxy,
    NUXEO_OPERATIONS.Document_CreateVersion,
    NUXEO_OPERATIONS.Document_Delete,
    NUXEO_OPERATIONS.Document_EmptyTrash,
    NUXEO_OPERATIONS.Document_Filter,
    NUXEO_OPERATIONS.Document_FollowLifecycleTransition,
    NUXEO_OPERATIONS.Document_GetChild,
    NUXEO_OPERATIONS.Document_GetChildren,
    NUXEO_OPERATIONS.Document_GetLastVersion,
    NUXEO_OPERATIONS.Document_GetParent,
    NUXEO_OPERATIONS.Document_GetVersions,
    NUXEO_OPERATIONS.Document_Lock,
    NUXEO_OPERATIONS.Document_Move,
    NUXEO_OPERATIONS.Document_MoveCollectionMember,
    NUXEO_OPERATIONS.Document_MultiPublish,
    NUXEO_OPERATIONS.Document_Order,
    NUXEO_OPERATIONS.Document_Publish,
    NUXEO_OPERATIONS.Document_PublishRendition,
    NUXEO_OPERATIONS.Document_PublishToSection,
    NUXEO_OPERATIONS.Document_PublishToSections,
    NUXEO_OPERATIONS.Document_Reload,
    NUXEO_OPERATIONS.Document_RemoveACL,
    NUXEO_OPERATIONS.Document_RemoveEntryOfMultivaluedProperty,
    NUXEO_OPERATIONS.Document_RemoveFacet,
    NUXEO_OPERATIONS.Document_RemoveFromFavorites,
    NUXEO_OPERATIONS.Document_RemoveItemFromListProperty,
    NUXEO_OPERATIONS.Document_RemovePermission,
    NUXEO_OPERATIONS.Document_RemoveProperty,
    NUXEO_OPERATIONS.Document_RemoveProxies,
    NUXEO_OPERATIONS.Document_ReplacePermission,
    NUXEO_OPERATIONS.Document_ResetSchema,
    NUXEO_OPERATIONS.Document_RestoreVersion,
    NUXEO_OPERATIONS.Document_Save,
    NUXEO_OPERATIONS.Document_SendNotificationEmailForPermission,
    NUXEO_OPERATIONS.Document_SetACE,
    NUXEO_OPERATIONS.Document_SetBlob,
    NUXEO_OPERATIONS.Document_SetLifeCycle,
    NUXEO_OPERATIONS.Document_SetProperty,
    NUXEO_OPERATIONS.Document_Subscribe,
    NUXEO_OPERATIONS.Document_Trash,
    NUXEO_OPERATIONS.Document_UnblockPermissionInheritance,
    NUXEO_OPERATIONS.Document_Unlock,
    NUXEO_OPERATIONS.Document_UnpublishAll,
    NUXEO_OPERATIONS.Document_Unsubscribe,
    NUXEO_OPERATIONS.Document_Untrash,
    NUXEO_OPERATIONS.Document_Update,
    NUXEO_OPERATIONS.Favorite_Fetch,
    NUXEO_OPERATIONS.Favorite_GetDocuments,
    NUXEO_OPERATIONS.GetLiveDocument,
    NUXEO_OPERATIONS.PDF_ExtractInfo,
    NUXEO_OPERATIONS.PDF_ExtractText,
    NUXEO_OPERATIONS.Proxy_GetSourceDocument,
    NUXEO_OPERATIONS.RemoveEntryOfMultivaluedProperty,
    NUXEO_OPERATIONS.User_GetCollections,
  ],
  Execution_Context: [
    NUXEO_OPERATIONS.Context_ReadMetadataFromBinary,
    NUXEO_OPERATIONS.Context_RestoreBlobInput,
    NUXEO_OPERATIONS.Context_RestoreBlobInputFromScript,
    NUXEO_OPERATIONS.Context_RestoreBlobsInput,
    NUXEO_OPERATIONS.Context_RestoreBlobsInputFromScript,
    NUXEO_OPERATIONS.Context_RestoreDocumentInput,
    NUXEO_OPERATIONS.Context_RestoreDocumentInputFromScript,
    NUXEO_OPERATIONS.Context_RestoreDocumentsInput,
    NUXEO_OPERATIONS.Context_RestoreDocumentsInputFromScript,
    NUXEO_OPERATIONS.Context_SetInputAsVar,
    NUXEO_OPERATIONS.Context_SetMetadataFromBlob,
    NUXEO_OPERATIONS.Context_SetVar,
    NUXEO_OPERATIONS.JsonStack_ToggleDisplay,
    NUXEO_OPERATIONS.Traces_Get,
    NUXEO_OPERATIONS.Traces_ToggleRecording,
  ],
  Execution_Flow: [
    NUXEO_OPERATIONS.Context_RunDocumentOperation,
    NUXEO_OPERATIONS.Context_RunDocumentOperationInNewTx,
    NUXEO_OPERATIONS.Context_RunFileOperation,
    NUXEO_OPERATIONS.Context_RunOperation,
    NUXEO_OPERATIONS.Context_RunOperationOnList,
    NUXEO_OPERATIONS.Context_RunOperationOnProvider,
    NUXEO_OPERATIONS.Document_SaveSession,
    NUXEO_OPERATIONS.Repository_SaveSession,
    NUXEO_OPERATIONS.RunDocumentOperation,
    NUXEO_OPERATIONS.RunFileOperation,
    NUXEO_OPERATIONS.RunOperation,
    NUXEO_OPERATIONS.RunOperationOnList,
    NUXEO_OPERATIONS.RunOperationOnProvider,
  ],
  Fetch: [
    NUXEO_OPERATIONS.Audit_PageProvider,
    NUXEO_OPERATIONS.Audit_QueryWithPageProvider,
    NUXEO_OPERATIONS.Blob_Create,
    NUXEO_OPERATIONS.Blob_CreateFromURL,
    NUXEO_OPERATIONS.Context_FetchDocument,
    NUXEO_OPERATIONS.Context_FetchFile,
    NUXEO_OPERATIONS.Document_Fetch,
    NUXEO_OPERATIONS.Document_FetchByProperty,
    NUXEO_OPERATIONS.Document_PageProvider,
    NUXEO_OPERATIONS.Document_Query,
    NUXEO_OPERATIONS.Repository_GetDocument,
    NUXEO_OPERATIONS.Repository_PageProvider,
    NUXEO_OPERATIONS.Repository_Query,
    NUXEO_OPERATIONS.Repository_ResultSetPageProvider,
    NUXEO_OPERATIONS.Repository_ResultSetQuery,
    NUXEO_OPERATIONS.ResultSet_PaginatedQuery,
    NUXEO_OPERATIONS.Resultset_PageProvider,
  ],
  Files: [
    NUXEO_OPERATIONS.Binary_ReadMetadata,
    NUXEO_OPERATIONS.Binary_WriteMetadataFromContext,
    NUXEO_OPERATIONS.Binary_WriteMetadataFromDocument,
    NUXEO_OPERATIONS.BlobHolder_Attach,
    NUXEO_OPERATIONS.BlobHolder_AttachOnCurrentDocument,
    NUXEO_OPERATIONS.Blob_Attach,
    NUXEO_OPERATIONS.Blob_AttachOnDocument,
    NUXEO_OPERATIONS.Blob_BulkDownload,
    NUXEO_OPERATIONS.Blob_CreateZip,
    NUXEO_OPERATIONS.Blob_ExportToFS,
    NUXEO_OPERATIONS.Blob_Get,
    NUXEO_OPERATIONS.Blob_GetAll,
    NUXEO_OPERATIONS.Blob_GetList,
    NUXEO_OPERATIONS.Blob_Post,
    NUXEO_OPERATIONS.Blob_PostToURL,
    NUXEO_OPERATIONS.Blob_ReadMetadata,
    NUXEO_OPERATIONS.Blob_Remove,
    NUXEO_OPERATIONS.Blob_RemoveFromDocument,
    NUXEO_OPERATIONS.Blob_SetFilename,
    NUXEO_OPERATIONS.Blob_SetMetadataFromContext,
    NUXEO_OPERATIONS.Blob_SetMetadataFromDocument,
    NUXEO_OPERATIONS.Blob_ToFile,
    NUXEO_OPERATIONS.Document_GetBlob,
    NUXEO_OPERATIONS.Document_GetBlobs,
    NUXEO_OPERATIONS.Document_GetBlobsByProperty,
    NUXEO_OPERATIONS.Document_GetContainerRendition,
    NUXEO_OPERATIONS.Document_GetRendition,
    NUXEO_OPERATIONS.Document_SetBlobName,
    NUXEO_OPERATIONS.Document_SetMetadataFromBlob,
    NUXEO_OPERATIONS.Document_TriggerMetadataMapping,
    NUXEO_OPERATIONS.Video_AddWatermark,
    NUXEO_OPERATIONS.Video_Concat,
  ],
  Local_Configuration: [
    NUXEO_OPERATIONS.LocalConfiguration_PutSimpleConfigurationParameter,
    NUXEO_OPERATIONS.LocalConfiguration_PutSimpleConfigurationParameters,
    NUXEO_OPERATIONS.LocalConfiguration_SetSimpleConfigurationParameterAsVar,
  ],
  Notification: [
    NUXEO_OPERATIONS.Document_Mail,
    NUXEO_OPERATIONS.Event_Fire,
    NUXEO_OPERATIONS.Log,
    NUXEO_OPERATIONS.LogOperation,
    NUXEO_OPERATIONS.Notification_SendEvent,
    NUXEO_OPERATIONS.Notification_SendMail,
  ],
  Push_Pop: [
    NUXEO_OPERATIONS.Blob_Pop,
    NUXEO_OPERATIONS.Blob_PopList,
    NUXEO_OPERATIONS.Blob_Pull,
    NUXEO_OPERATIONS.Blob_PullList,
    NUXEO_OPERATIONS.Blob_Push,
    NUXEO_OPERATIONS.Blob_PushList,
    NUXEO_OPERATIONS.Context_PopBlob,
    NUXEO_OPERATIONS.Context_PopBlobList,
    NUXEO_OPERATIONS.Context_PopDocument,
    NUXEO_OPERATIONS.Context_PopDocumentList,
    NUXEO_OPERATIONS.Context_PullBlob,
    NUXEO_OPERATIONS.Context_PullBlobList,
    NUXEO_OPERATIONS.Context_PullDocument,
    NUXEO_OPERATIONS.Context_PullDocumentList,
    NUXEO_OPERATIONS.Context_PushBlob,
    NUXEO_OPERATIONS.Context_PushBlobList,
    NUXEO_OPERATIONS.Context_PushDocument,
    NUXEO_OPERATIONS.Context_PushDocumentList,
    NUXEO_OPERATIONS.Document_Pop,
    NUXEO_OPERATIONS.Document_PopList,
    NUXEO_OPERATIONS.Document_Pull,
    NUXEO_OPERATIONS.Document_PullList,
    NUXEO_OPERATIONS.Document_Push,
    NUXEO_OPERATIONS.Document_PushList,
  ],
  Routing: [
    NUXEO_OPERATIONS.Document_Routing_GetGraph,
    NUXEO_OPERATIONS.Document_Routing_UpdateCommentsInfoOnDocument,
  ],
  Scripting: [
    NUXEO_OPERATIONS.Context_RunInputScript,
    NUXEO_OPERATIONS.Context_RunScript,
    NUXEO_OPERATIONS.RunInputScript,
    NUXEO_OPERATIONS.RunScript,
  ],
  Services: [
    NUXEO_OPERATIONS.Actions_GET,
    NUXEO_OPERATIONS.Audit_Log,
    NUXEO_OPERATIONS.Audit_LogEvent,
    NUXEO_OPERATIONS.Audit_Restore,
    NUXEO_OPERATIONS.Bulk_RunAction,
    NUXEO_OPERATIONS.Bulk_WaitForAction,
    NUXEO_OPERATIONS.Collection_Suggestion,
    NUXEO_OPERATIONS.Counters_GET,
    NUXEO_OPERATIONS.Directory_CreateEntries,
    NUXEO_OPERATIONS.Directory_CreateVocabularyEntry,
    NUXEO_OPERATIONS.Directory_DeleteEntries,
    NUXEO_OPERATIONS.Directory_Entries,
    NUXEO_OPERATIONS.Directory_LoadFromCSV,
    NUXEO_OPERATIONS.Directory_Projection,
    NUXEO_OPERATIONS.Directory_ReadEntries,
    NUXEO_OPERATIONS.Directory_SuggestEntries,
    NUXEO_OPERATIONS.Directory_UpdateEntries,
    NUXEO_OPERATIONS.Document_AddRelation,
    NUXEO_OPERATIONS.Document_DeleteRelation,
    NUXEO_OPERATIONS.Document_Export,
    NUXEO_OPERATIONS.Document_GetLinkedDocuments,
    NUXEO_OPERATIONS.Elasticsearch_WaitForIndexing,
    NUXEO_OPERATIONS.FileManager_CreateFolder,
    NUXEO_OPERATIONS.FileManager_Import,
    NUXEO_OPERATIONS.FileManager_ImportWithProperties,
    NUXEO_OPERATIONS.Metrics_Start,
    NUXEO_OPERATIONS.Metrics_Stop,
    NUXEO_OPERATIONS.NuxeoDrive_AttachBlob,
    NUXEO_OPERATIONS.NuxeoDrive_CreateFile,
    NUXEO_OPERATIONS.NuxeoDrive_CreateFolder,
    NUXEO_OPERATIONS.NuxeoDrive_CreateTestDocuments,
    NUXEO_OPERATIONS.NuxeoDrive_Delete,
    NUXEO_OPERATIONS.NuxeoDrive_FileSystemItemExists,
    NUXEO_OPERATIONS.NuxeoDrive_GetChangeSummary,
    NUXEO_OPERATIONS.NuxeoDrive_GetChildren,
    NUXEO_OPERATIONS.NuxeoDrive_GetFileSystemItem,
    NUXEO_OPERATIONS.NuxeoDrive_GetRoots,
    NUXEO_OPERATIONS.NuxeoDrive_GetTopLevelFolder,
    NUXEO_OPERATIONS.NuxeoDrive_Move,
    NUXEO_OPERATIONS.NuxeoDrive_Rename,
    NUXEO_OPERATIONS.NuxeoDrive_ScrollDescendants,
    NUXEO_OPERATIONS.NuxeoDrive_SetActiveFactories,
    NUXEO_OPERATIONS.NuxeoDrive_SetSynchronization,
    NUXEO_OPERATIONS.NuxeoDrive_SetupIntegrationTests,
    NUXEO_OPERATIONS.NuxeoDrive_TearDownIntegrationTests,
    NUXEO_OPERATIONS.NuxeoDrive_UpdateFile,
    NUXEO_OPERATIONS.PermissionsPurge,
    NUXEO_OPERATIONS.Picture_Create,
    NUXEO_OPERATIONS.Picture_RecomputeViews,
    NUXEO_OPERATIONS.RecomputeThumbnails,
    NUXEO_OPERATIONS.Relations_CreateRelation,
    NUXEO_OPERATIONS.Relations_DeleteRelation,
    NUXEO_OPERATIONS.Relations_GetRelations,
    NUXEO_OPERATIONS.Search_Index,
    NUXEO_OPERATIONS.Search_WaitForIndexing,
    NUXEO_OPERATIONS.Service_HotReloadStudioSnapshot,
    NUXEO_OPERATIONS.Services_RemoveDocumentTags,
    NUXEO_OPERATIONS.Services_TagDocument,
    NUXEO_OPERATIONS.Services_UntagDocument,
    NUXEO_OPERATIONS.Tag_Suggestion,
    NUXEO_OPERATIONS.Task_Create,
    NUXEO_OPERATIONS.Task_GetAssigned,
    NUXEO_OPERATIONS.UserGroup_Suggestion,
    NUXEO_OPERATIONS.UserWorkspace_CreateDocumentFromBlob,
    NUXEO_OPERATIONS.WorkManager_RunWorkInFailure,
    NUXEO_OPERATIONS.Workflow_CreateTask,
    NUXEO_OPERATIONS.Workflow_GetTask,
    NUXEO_OPERATIONS.Workflow_UserTaskPageProvider,
  ],
  User_Interface: [
    NUXEO_OPERATIONS.Search_SuggestersLauncher,
  ],
  Users_Groups: [
    NUXEO_OPERATIONS.Auth_LoginAs,
    NUXEO_OPERATIONS.Auth_Logout,
    NUXEO_OPERATIONS.Context_GetEmailsWithPermissionOnDoc,
    NUXEO_OPERATIONS.Context_GetUsersGroupIdsWithPermissionOnDoc,
    NUXEO_OPERATIONS.Document_GetPrincipalEmails,
    NUXEO_OPERATIONS.Document_GetUsersAndGroups,
    NUXEO_OPERATIONS.Group_CreateOrUpdate,
    NUXEO_OPERATIONS.NuxeoPrincipal_Get,
    NUXEO_OPERATIONS.Services_CreateUser,
    NUXEO_OPERATIONS.Services_QueryUsers,
    NUXEO_OPERATIONS.UserWorkspace_Get,
    NUXEO_OPERATIONS.User_CreateOrUpdate,
    NUXEO_OPERATIONS.User_Get,
    NUXEO_OPERATIONS.User_GetUserWorkspace,
    NUXEO_OPERATIONS.User_Invite,
    NUXEO_OPERATIONS.User_Query,
  ],
  Workflow_Context: [
    NUXEO_OPERATIONS.BulkRestartWorkflow,
    NUXEO_OPERATIONS.Context_ApplyMappingOnTask,
    NUXEO_OPERATIONS.Context_CancelWorkflow,
    NUXEO_OPERATIONS.Context_GetOpenTasks,
    NUXEO_OPERATIONS.Context_GetTaskNames,
    NUXEO_OPERATIONS.Context_SetWorkflowNodeVar,
    NUXEO_OPERATIONS.Context_SetWorkflowVar,
    NUXEO_OPERATIONS.Context_StartWorkflow,
    NUXEO_OPERATIONS.Task_ApplyDocumentMapping,
    NUXEO_OPERATIONS.WorkflowInstance_Cancel,
    NUXEO_OPERATIONS.WorkflowModel_BulkRestartInstances,
    NUXEO_OPERATIONS.WorkflowTask_Complete,
    NUXEO_OPERATIONS.Workflow_CompleteTaskOperation,
    NUXEO_OPERATIONS.Workflow_GetOpenTasks,
    NUXEO_OPERATIONS.Workflow_ResumeNode,
    NUXEO_OPERATIONS.Workflow_ResumeNodeOperation,
    NUXEO_OPERATIONS.Workflow_SetNodeVariable,
  ],
} as const;

/**
 * Nuxeo Operation Aliases (84 aliases)
 * 
 * Alternative names for operations. These aliases can be used
 * interchangeably with the main operation names.
 */
export const NUXEO_OPERATION_ALIASES = {
  AddEntryToMultivaluedProperty: 'AddEntryToMultivaluedProperty', // Alias
  Audit_Log: 'Audit.Log', // Alias
  Audit_PageProvider: 'Audit.PageProvider', // Alias
  Binary_ReadMetadata: 'Binary.ReadMetadata', // Alias
  Binary_WriteMetadataFromContext: 'Binary.WriteMetadataFromContext', // Alias
  Binary_WriteMetadataFromDocument: 'Binary.WriteMetadataFromDocument', // Alias
  Blob_Attach: 'Blob.Attach', // Alias
  Blob_Create: 'Blob.Create', // Alias
  Blob_Get: 'Blob.Get', // Alias
  Blob_GetAll: 'Blob.GetAll', // Alias
  Blob_GetList: 'Blob.GetList', // Alias
  Blob_Pop: 'Blob.Pop', // Alias
  Blob_PopList: 'Blob.PopList', // Alias
  Blob_Post: 'Blob.Post', // Alias
  Blob_Pull: 'Blob.Pull', // Alias
  Blob_PullList: 'Blob.PullList', // Alias
  Blob_Push: 'Blob.Push', // Alias
  Blob_PushList: 'Blob.PushList', // Alias
  Blob_Remove: 'Blob.Remove', // Alias
  Blob_Set: 'Blob.Set', // Alias
  Blob_SetFilename: 'Blob.SetFilename', // Alias
  Blob_ToFile: 'Blob.ToFile', // Alias
  BlobHolder_Attach: 'BlobHolder.Attach', // Alias
  BulkRestartWorkflow: 'BulkRestartWorkflow', // Alias
  Collection_AddToCollection: 'Collection.AddToCollection', // Alias
  Collection_AddToFavorites: 'Collection.AddToFavorites', // Alias
  Collection_CreateCollection: 'Collection.CreateCollection', // Alias
  Collection_GetCollections: 'Collection.GetCollections', // Alias
  Collection_GetElementsInFavorite: 'Collection.GetElementsInFavorite', // Alias
  Collection_RemoveFromFavorites: 'Collection.RemoveFromFavorites', // Alias
  Context_ApplyMappingOnTask: 'Context.ApplyMappingOnTask', // Alias
  Context_CancelWorkflow: 'Context.CancelWorkflow', // Alias
  Context_GetOpenTasks: 'Context.GetOpenTasks', // Alias
  Context_ReadMetadataFromBinary: 'Context.ReadMetadataFromBinary', // Alias
  Context_RunDocumentOperation: 'Context.RunDocumentOperation', // Alias
  Context_RunFileOperation: 'Context.RunFileOperation', // Alias
  Context_RunInputScript: 'Context.RunInputScript', // Alias
  Context_RunOperation: 'Context.RunOperation', // Alias
  Context_RunOperationOnList: 'Context.RunOperationOnList', // Alias
  Context_RunOperationOnProvider: 'Context.RunOperationOnProvider', // Alias
  Context_RunScript: 'Context.RunScript', // Alias
  Context_SetWorkflowNodeVar: 'Context.SetWorkflowNodeVar', // Alias
  CreateProxyLive: 'CreateProxyLive', // Alias
  Document_AddACL: 'Document.AddACL', // Alias
  Document_Fetch: 'Document.Fetch', // Alias
  Document_GetPrincipalEmails: 'Document.GetPrincipalEmails', // Alias
  Document_GetUsersAndGroups: 'Document.GetUsersAndGroups', // Alias
  Document_MultiPublish: 'Document.MultiPublish', // Alias
  Document_PageProvider: 'Document.PageProvider', // Alias
  Document_Pop: 'Document.Pop', // Alias
  Document_PopList: 'Document.PopList', // Alias
  Document_Publish: 'Document.Publish', // Alias
  Document_PublishRendition: 'Document.PublishRendition', // Alias
  Document_Pull: 'Document.Pull', // Alias
  Document_PullList: 'Document.PullList', // Alias
  Document_Push: 'Document.Push', // Alias
  Document_PushList: 'Document.PushList', // Alias
  Document_Query: 'Document.Query', // Alias
  Document_SaveSession: 'Document.SaveSession', // Alias
  Document_SetACE: 'Document.SetACE', // Alias
  Document_SetLifeCycle: 'Document.SetLifeCycle', // Alias
  Document_TriggerMetadataMapping: 'Document.TriggerMetadataMapping', // Alias
  DocumentMultivaluedProperty_addItem: 'DocumentMultivaluedProperty.addItem', // Alias
  Elasticsearch_WaitForIndexing: 'Elasticsearch.WaitForIndexing', // Alias
  GetLiveDocument: 'GetLiveDocument', // Alias
  LogOperation: 'LogOperation', // Alias
  Notification_SendEvent: 'Notification.SendEvent', // Alias
  Notification_SendMail: 'Notification.SendMail', // Alias
  NuxeoPrincipal_Get: 'NuxeoPrincipal.Get', // Alias
  Picture_getView: 'Picture.getView', // Alias
  Picture_resize: 'Picture.resize', // Alias
  Relations_CreateRelation: 'Relations.CreateRelation', // Alias
  Relations_DeleteRelation: 'Relations.DeleteRelation', // Alias
  Relations_GetRelations: 'Relations.GetRelations', // Alias
  RemoveEntryOfMultivaluedProperty: 'RemoveEntryOfMultivaluedProperty', // Alias
  Resultset_PageProvider: 'Resultset.PageProvider', // Alias
  ResultSet_PaginatedQuery: 'ResultSet.PaginatedQuery', // Alias
  Services_CreateUser: 'Services.CreateUser', // Alias
  Services_QueryUsers: 'Services.QueryUsers', // Alias
  UserWorkspace_Get: 'UserWorkspace.Get', // Alias
  Workflow_CompleteTaskOperation: 'Workflow.CompleteTaskOperation', // Alias
  Workflow_CreateTask: 'Workflow.CreateTask', // Alias
  Workflow_GetTask: 'Workflow.GetTask', // Alias
  Workflow_ResumeNodeOperation: 'Workflow.ResumeNodeOperation', // Alias
} as const;

