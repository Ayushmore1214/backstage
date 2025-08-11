/**
 * Configuration schema for the glossary plugin
 */
export interface Config {
  /** Configuration for the glossary plugin */
  glossary?: {
    /**
     * Maximum number of terms that can be returned in a single request
     * @default 100
     */
    maxTermsPerRequest?: number;
    
    /**
     * Whether to enable search functionality
     * @default true
     */
    enableSearch?: boolean;
  };
}